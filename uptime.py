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
    requests()
    parseShort()
    parseLong()
    deleteOld()


def requests():
    domains=[]
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    #Select all domains from database
    cursor = dbCon.cursor()
    cursor.execute("SELECT id, name, url, ip FROM domains")
    for (id, name, url, ip) in cursor:
        domains.append((id,name,url,ip))
    cursor.close()
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
        cursor = dbCon.cursor()
        cursor.execute("INSERT INTO requests (domain_id,status_code,error_message,ping_time,http_time) VALUES (%s,%s,%s,%s,%s)",requestData)
        dbCon.commit()
        cursor.close()
        dbCon.close()
    threading.Timer(60,requests).start()
def parseShort():
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    timeDelta = datetime.timedelta(min=20)
    nowDateString = datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
    thenDateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d %H:%M:%S')
    queryString = "SELECT domains.name as name,access_time,status_code,error_message,ping_time,http_time FROM requests JOIN domains ON requests.domain_id=domains.id WHERE access_time BETWEEN '{:s}' AND '{:s}' ORDER BY requests.access_time DESC".format(thenDateString,nowDateString)
    data = pd.read_sql(queryString, con=dbCon)
    dbCon.close()
    jsonData={}
    print( "Start of short parse: ")
    names = data.name.unique()
    print("Names:")
    print(names)
    for name in names:
        print("Starting :" + name)
        nameData=data.loc[data['name']==name]
        nameJsonData={}
        # Is site up?
        statusCounts = pd.value_counts(nameData['status_code'].values)
        print("Status code counts:")
        print(statusCounts)
        if statusCounts['200']!= None:
            nameJsonData["status"] = statusCounts['200']/nameData.shape[0]
        else: nameJsonData["status"] = 0
        # Whats the average ping timeDelta
        print ("Average ping time")
        print (nameData['ping_time'].mean())
        nameJsonData["meanPingTime"] = nameData['ping_time'].mean()
        # Whats the average http timeDelta
        print ("Average http time")
        print (nameData['http_time'].mean())
        nameJsonData["meanHttpTime"] = nameData['http_time'].mean()
        # add to main json
        jsonData[name] = nameJsonData
    print ("Final json:")
    print (jsonData)
    threading.Timer(60,parseShort).start()
def parseLong():
    threading.Time(40000,parseLong).start()
def deleteOld():
    threading.Timer(86400,deleteOld).start()

if __name__=="__main__":
    main()
