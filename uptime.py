# Author: Brenden Sweetman brenden.sweetman@wustl.edu
# Title: uptime.py
# Purpose: check the uptime of the given domains and store the results in the
#   uptime database
import requests
from mysql import connector
import time
import subprocess
import re
import threading
import datetime
import pandas as pd
import json
def main():
    httpCheck()
    parseShort()
    parseLong()
    deleteOld()


def httpCheck():
    domains=[]
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    #Select all domains from database
    cursor = dbCon.cursor()
    cursor.execute("SELECT id, name, url, ip FROM domains")
    for (id, name, url, ip) in cursor:
        domains.append((id,name,url,ip))
    for domain in domains:
        requestData = ()
        errorMessage = ""
        pingTime=0
        httpTime=0
        statusCode=0
        try:
            httpStart = time.time()
            response = requests.get("https://"+domain[2])
            httpTime= (time.time()-httpStart) * 1000
            statusCode = response.status_code
        except:
            try:
                httpStart = time.time()
                response = requests.get("http://"+domain[2])
                httpTime = (time.time() - httpStart) * 1000
                errorMessage = errorMessage + "NO_HTTPS,"
                statusCode = response.status_code
            except:
                errorMessage = errorMessage + "CONNECTION_ERROR,"

        pingResults = subprocess.Popen(["ping","-c","1",re.findall(r"([\w\.\-]+)",domain[2])[0]], stdout = subprocess.PIPE).communicate()[0].decode("utf-8")
        if re.search(r"time=([\d\.]+)",pingResults)==None:
            errorMessage = errorMessage + "NO_PING,"
        else:
            pingTime= re.findall(r"time=([\d\.]+)",pingResults)[0]

        requestData=(domain[0],statusCode,errorMessage,pingTime,httpTime)
        cursor.execute("INSERT INTO requests (domain_id,status_code,error_message,ping_time,http_time) VALUES (%s,%s,%s,%s,%s)",requestData)
    dbCon.commit()
    cursor.close()
    dbCon.close()
    threading.Timer(60,httpCheck).start()
def parseShort():
    parse(1200,"shortData.json")
    threading.Timer(60,parseShort).start()
def parseLong():
    parse(604800,"longData.json")
    threading.Timer(40000,parseLong).start()
def parse(delta,fileName):
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    timeDelta = datetime.timedelta(seconds=delta)
    nowDateString = datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
    thenDateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d %H:%M:%S')
    queryString = "SELECT domains.name as name,access_time,status_code,error_message,ping_time,http_time FROM requests JOIN domains ON requests.domain_id=domains.id WHERE access_time BETWEEN '{:s}' AND '{:s}' ORDER BY requests.access_time DESC".format(thenDateString,nowDateString)
    data = pd.read_sql(queryString, con=dbCon)
    dbCon.close()
    jsonData={}
    names = data.name.unique()
    for name in names:
        nameData=data.loc[data['name']==name]
        nameJsonData={}
        # Is site up?
        statusCounts = pd.value_counts(nameData['status_code'].values)
        try:
            nameJsonData["status"] = statusCounts[200]/nameData.shape[0]
        except: nameJsonData["status"] = 0
        # Whats the average ping timeDelta
        nameJsonData["meanPingTime"] = nameData['ping_time'].mean()
        # Whats the average http timeDelta
        nameJsonData["meanHttpTime"] = nameData['http_time'].mean()
        # add to main json
        jsonData[name] = nameJsonData
    with open("fileName", 'w') as file:
        json.dump(jsonData,file)
def deleteOld():
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    cursor = dbCon.cursor()
    timeDelta = datetime.timedelta(days=30)
    dateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d %H:%M:%S')
    queryString = "DELETE FROM requests WHERE access_time < '{:s}'".format(dateString)
    cursor.execute(queryString)
    dbCon.commit()
    cursor.close()
    dbCon.close()
    threading.Timer(86400,deleteOld).start()

if __name__=="__main__":
    main()
