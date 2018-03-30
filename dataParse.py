from mysql import connector
import pandas as pd
import datetime
import matplotlib
timeDelta = datetime.timedelta(days=30)
nowDateString = datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
thenDateString = (datetime.datetime.today()-timeDelta).strftime('%Y-%m-%d %H:%M:%S')
dbCon = connector.connect(user="uptime", password="vNg&.+4]6h2nuR00", host='localhost', database="uptime")
queryString = "SELECT domains.name as name,access_time,status_code,error_message,ping_time,http_time FROM requests JOIN domains ON requests.domain_id=domains.id WHERE access_time BETWEEN '{:s}' AND '{:s}' ORDER BY requests.access_time DESC".format(thenDateString,nowDateString)
df = pd.read_sql(queryString, con=dbCon)
aresDF=df.loc[df['name'] == 'Ares']
dates=[]
for date in aresDF['access_time']:
    dates.append(matplotlib.dates.date2num(date))
df.plot(y='ping_time',x='name', kind="box")
df.plot(y='http_time', x='name', kind="box")
matplotlib.pyplot.show()
