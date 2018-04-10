# Author: Brenden Sweetman brenden.sweetman@wustl.edu
# Title: uptime.py
# Purpose: check the uptime of the given domains and store the results in the
#   uptime database
import requests
from mysql import connector
import time
import subprocess
import re
import sched
# connect to database
dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
#time in seconds between checks
requestDelay=60
# create event scheduler
schedule = sched.scheduler(time.time,time.sleep) 
# Keep a tuple list of all domains
domains=[]
def main():
    #Select all domains from database
    cursor = dbCon.cursor()
    cursor.execute("SELECT id, name, url, ip FROM domains")
    for (id, name, url, ip) in cursor:
        domains.append((id,name,url,ip))
    cursor.close()
    schedule.enter(requestDelay,1,run)
    schedule.run()
    

def run():
    for domain in domains:
        requestData = ()
        errorMessage = ""
        pingTime=0

        try:
            httpStart = time.time()
            response = requests.get("https://"+domain[2])
            httpTime= (time.time()-httpStart) * 1000
        except:
            try:
                httpStart = time.time()
                response = requests.get("http://"+domain[2])
                httpTime = (time.time() - httpStart) * 1000
                errorMessage = errorMessage + "NO_HTTPS,"
            except:
                errorMessage = errorMessage + "CONNECTION_ERROR,"
        statusCode = response.status_code

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
    schedule.enter(requestDelay,1,run)
    schedule.run()
if __name__=="__main__":
    main()
