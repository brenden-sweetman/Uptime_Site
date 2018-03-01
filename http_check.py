#!/usr/bin/env python3
#Author: Brenden Sweetman brenden.sweetman@wustl.edu
#Title: http_check.py
#Purpose: Run a uptime check for a domain and all suporting files
#    For now the script just outputs the resutls to sysout

import requests
import sys, os
import re
domainname=""
def main():
    global domainname
    if len(sys.argv) < 2:
        sys.exit(f"Usage: {sys.argv[0]} domainname")
    domainname="https://"+sys.argv[1]
    print(domainname)
    request=getUrl(domainname)
    if request is not None:
        print(request.status_code)
        text=request.text
        if(request.status_code==200):
            resourceTags=[]
            resources=re.findall(r"<link((?:\s+\w+=\"[\w\_\-\.\/\:]+\")+)",text)
            for s in resources:
                resourceTags.append(re.findall(r"(\w+)=\"([\w\_\-\.\/\:]+)\"",s))
            requestHandler(resourceTags)
        else:
            print("Request Code: "+ request.status_code)

def requestHandler(tags):
    global domainname
    rel=""
    href=""
    linkType=""
    media=""
    for request in tags:
        for tag in request:
            if tag[0]=="rel":
                rel=tag[1]
            elif tag[0]=="href":
                href=tag[1]
            elif tag[0]=="type":
                linkType=tag[1]
            elif tag[0]=="media":
                media=tag[1]
            else:
                print("Unknown Tag: "+tag[0]+"=\""+tag[1])
        url=href
        if "http" not in href:
            url=domainname+"/"+href
        request=getUrl(url)
        if request is not None:
            print("Page Resource:\n\trel: {:s}\n\thref: {:s}\n\ttype: {:s}\n\tmedia: {:s}\n\tstatus code: {:d}".format(rel,href,linkType,media,request.status_code))
        rel=href=linkType=media=""
def getUrl(url):
    request=None
    try:
        request=requests.get(url)
    except requests.exceptions.RequestException as e:
        print("Request Error: "+e)
    return request
if __name__ == "__main__":
    main()
