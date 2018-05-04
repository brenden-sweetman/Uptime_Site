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

# main:
#   start call all methods to start threaded processes
def main():
    httpCheck()
    parseShort()
    parseLong()
    deleteOld()
# httpCheck:
#   Pull all domains from database
#   for each domain:
#        run an http request
#        run a ping request
#        add results to the database
def httpCheck():
    # pull domains from database
    domains=[]
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    #Select all domains from database
    cursor = dbCon.cursor()
    cursor.execute("SELECT id, name, url, ip FROM domains")
    for (id, name, url, ip) in cursor:
        domains.append((id,name,url,ip))
    # perform requests for each domain
    for domain in domains:
        requestData = ()
        errorMessage = ""
        pingTime=0
        httpTime=0
        statusCode=0
        # try https requests first
        try:
            httpStart = time.time()
            response = requests.get("https://"+domain[2])
            httpTime= (time.time()-httpStart) * 1000
            statusCode = response.status_code
        except:
            # try without https
            try:
                httpStart = time.time()
                response = requests.get("http://"+domain[2])
                httpTime = (time.time() - httpStart) * 1000
                errorMessage = errorMessage + "NO_HTTPS,"
                statusCode = response.status_code
            # report error if no connection could be made
            except:
                errorMessage = errorMessage + "CONNECTION_ERROR,"
        # use subprocess to run a ping request
        pingResults = subprocess.Popen(["ping","-c","1",re.findall(r"([\w\.\-]+)",domain[2])[0]], stdout = subprocess.PIPE).communicate()[0].decode("utf-8")
        # use regex to pull ping data from subprocess
        if re.search(r"time=([\d\.]+)",pingResults)==None:
            errorMessage = errorMessage + "NO_PING,"
        else:
            pingTime= re.findall(r"time=([\d\.]+)",pingResults)[0]
        # add request data to database
        requestData=(domain[0],statusCode,errorMessage,pingTime,httpTime)
        cursor.execute("INSERT INTO requests (domain_id,status_code,error_message,ping_time,http_time) VALUES (%s,%s,%s,%s,%s)",requestData)
    dbCon.commit()
    cursor.close()
    dbCon.close()
    # call a treading timer to run method again in 60 seconds
    threading.Timer(60,httpCheck).start()
# parseLong:
#   pull data for the last week and create a json with database
#   for each domain calculate the uptime, mean ping time, and mean http access time for each days
def parseLong():
    # pull data from last week from database
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    timeDelta = datetime.timedelta(days=7)
    nowDateString = datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
    thenDateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d')
    queryString = "SELECT domains.name as name,domain_id,access_time,status_code,error_message,ping_time,http_time FROM requests JOIN domains ON requests.domain_id=domains.id WHERE access_time BETWEEN '{:s}' AND '{:s}' ORDER BY requests.access_time DESC".format(thenDateString,nowDateString)
    data = pd.read_sql(queryString, con=dbCon)
    dbCon.close()
    # prepare data for parsing
    jsonData={}
    # pull each name
    names = data.name.unique()
    # pull each day
    dates = data.access_time.map(lambda t: t.date()).unique()
    # create new entry for each name
    for i,name in enumerate(names):
        nameData=data.loc[data['name']==name]
        nameJsonData={}
        nameJsonData["name"]= name
        nameJsonData["id"] = str(nameData['domain_id'].values[0])
        # create a new entry for each date in the entry for the name
        for date in dates:
            # pull entries forthe day
            dateData=nameData.loc[nameData['access_time'].map(lambda t: t.date())==date]
            dateJsonData={}
            # Is site up?
            statusCounts = pd.value_counts(dateData['status_code'].values)
            try:
                dateJsonData["status"] = statusCounts[200]/nameData.shape[0]
            except: dateJsonData["status"] = 0
            # Whats the average ping timeDelta
            dateJsonData["meanPingTime"] = dateData['ping_time'].mean()
            # Whats the average http timeDelta
            dateJsonData["meanHttpTime"] = dateData['http_time'].mean()
            #add to nameJson list
            nameJsonData[date.strftime('%Y-%m-%d')]=dateJsonData
        #add nameJson to main dateJsonData
        jsonData[str(i)]=nameJsonData
    # write json
    with open("longData.json", 'w') as file:
        json.dump(jsonData,file)
    # call a timer to run method again in 10 min
    threading.Timer(6000,parseLong).start()
# parseShort
#   pull data from the last 20 min to determine the current status of each site
#   for each name calculate the uptime, mean ping time and mean http request time
def parseShort():
    # pull data from database
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    timeDelta = datetime.timedelta(seconds=1200)
    nowDateString = datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
    thenDateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d %H:%M:%S')
    queryString = "SELECT domains.name as name,domain_id,access_time,status_code,error_message,ping_time,http_time FROM requests JOIN domains ON requests.domain_id=domains.id WHERE access_time BETWEEN '{:s}' AND '{:s}' ORDER BY requests.access_time DESC".format(thenDateString,nowDateString)
    data = pd.read_sql(queryString, con=dbCon)
    dbCon.close()
    jsonData={}
    # pull each name
    names = data.name.unique()
    # for each name calculate values
    for i,name in enumerate(names):
        # pull data for only this site
        nameData=data.loc[data['name']==name]
        nameJsonData={}
        nameJsonData["name"] = name
        nameJsonData["id"] = str(nameData['domain_id'].values[0])
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
        jsonData[str(i)] = nameJsonData
    # write json
    with open("shortData.json", 'w') as file:
        json.dump(jsonData,file)
    #start timer to call this method again in 60 seconds
    threading.Timer(60,parseShort).start()
# deleteOld
#   remove the entries older than a month from the database
def deleteOld():
    # remove old entries
    dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
    cursor = dbCon.cursor()
    timeDelta = datetime.timedelta(days=30)
    dateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d %H:%M:%S')
    queryString = "DELETE FROM requests WHERE access_time < '{:s}'".format(dateString)
    cursor.execute(queryString)
    dbCon.commit()
    cursor.close()
    dbCon.close()
    # start timer to call this method in 24 hours
    threading.Timer(86400,deleteOld).start()

# start program
if __name__=="__main__":
    main()
