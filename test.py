import requests
status_code = {}
for i in range(150):
    res = requests.get('http://127.0.0.1:3000/hello-world')
    if res.status_code in status_code:
        status_code[res.status_code] += 1
    else:
        status_code[res.status_code] = 1

for x in status_code:
    print('status code: ', x, '\tnumber: ', status_code[x])