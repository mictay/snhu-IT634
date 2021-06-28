# Node
Install node 14.17.0

# SPA
```
e:
cd \git\mictay\main\snhu-IT634\spa
nvm 14
npm i
ng serve
```

# mat-select

https://stackblitz.com/edit/am-all-imports-skopwn?file=app%2Fapp.component.html  


# Service


The link below was updated for angular 12 breaking changes 
https://www.positronx.io/angular-7-httpclient-http-service/  


# AWS URLS
cloudfront secure:  https://d1i83h7yfh6s26.cloudfront.net/#/flights
s3 static (not secure):  http://it634.mictay.com.s3-website-us-east-1.amazonaws.com/#/flights

# Angular 11 Router
https://www.techiediaries.com/routing-angular-router/

# National Weather Service API
Issue with this service, its only US National territories.  Not international like our data.  

example:  https://api.weather.gov/points/28.7071,-81.5817

# Open Weather map
International Weather Information  
https://home.openweathermap.org/api_keys  

FREE TIER  
60 calls/minute  
1,000,000 calls/month  

examples:  

https://api.openweathermap.org/data/2.5/weather?lat=28.7071&lon=-81.5817&appid=04a068829101c712d9e1643f4b09eeee  

https://api.openweathermap.org/data/2.5/weather?lat=28.7071&lon=-81.5817&appid=4c15a2d35dde14f5544ba4692ad0e25b  

https://api.openweathermap.org/data/2.5/weather?lat=28.4293994904&lon=-81.3089981079&appid=4c15a2d35dde14f5544ba4692ad0e25b  

## ICON Information  
reference:  https://openweathermap.org/weather-conditions  

example  
```
  icon.innerHTML = '<img src="http://openweathermap.org/img/wn/' +iconValue+'@2x.png">';

```

# Country



# Callback

https://snhu-it634.auth.us-east-1.amazoncognito.com/login?client_id=5qnp0rquuvkj81eqsv1qa1si1k&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://d1i83h7yfh6s26.cloudfront.net/index.html

https://example.com/callback#id_token=eyJraWQiOiI1dzQ2cU5hUmVWenA5R3VldDUrbjNGbmVqVjR1Q0xPcFdtclN1N0NGZnZBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRjVlNENtRnhKS3RldlFlcmh2NHl2dyIsInN1YiI6IjFjYWIzNzE3LTZiY2MtNGY4My04NDMxLTEwYTE5NmUyYjRmNSIsImF1ZCI6IjVxbnAwcnF1dXZrajgxZXFzdjFxYTFzaTFrIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjQ4NTA3MjIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzBzMXBnZ1VCMCIsIm5hbWUiOiJNaWNoYWVsIiwiY29nbml0bzp1c2VybmFtZSI6Im1pY3RheSIsImV4cCI6MTYyNDg1NDMyMiwiaWF0IjoxNjI0ODUwNzIyLCJqdGkiOiI0MDFiMDUxOC1iMWU0LTRiOGMtOTY4Ny1lZjg2YTEwOGUyMjMifQ.QKWTTeTcurh0FE7rJuWVoPTIJa0bVTKLZYhWdfUj6saW4LMb1iQCgvdhTKYJ2u79XsAblTTAnGBTZX83fMgsN8XNJM2jObnPpH_fGJnajK5XsB-Vfp_kcRyn1jLKEc7OSDEca0zq6G7SpDF__ThQg3pOJsAbGalhcpc84HsDGVGjbrJpB_lDSgmfUX5SBbH5cRYb4fcf_oGF1QIpyKPBIyKxHB3tS1RECzXzE7PQJjwwKut0LYCW8gp401AP_7WcpmlnYDyUbx2BULwTx20xlck-qdzPODtwF3xATXlAmb0HAgtEBtwZFRzViSsqAS12TI4jbTQCLQRhr2-STldK0w&access_token=eyJraWQiOiJTT0xwanFGaGFxUnFuNElKQTlSUElzaVVWRUJ1ajdYZ2FaU2VjWE5GXC8rMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxY2FiMzcxNy02YmNjLTRmODMtODQzMS0xMGExOTZlMmI0ZjUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjI0ODUwNzIyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8wczFwZ2dVQjAiLCJleHAiOjE2MjQ4NTQzMjIsImlhdCI6MTYyNDg1MDcyMiwidmVyc2lvbiI6MiwianRpIjoiZmM3N2Y5ZWEtYWExNS00NjIxLTlhMzAtMDE2OWU0NDM5YjAwIiwiY2xpZW50X2lkIjoiNXFucDBycXV1dmtqODFlcXN2MXFhMXNpMWsiLCJ1c2VybmFtZSI6Im1pY3RheSJ9.ihwWKWLVpTqu3FLjOB3upH56g7PxUFybNj6S21MoJueVHvhtP9CD_J_TKz2A6ktfeC7PBMsdIUvr1kt1two3L2eAGpSYu6oayZAhXlYK6TJ7DwUK21El068nRZJBBPh26VyCZbxwbk0D3Svbqx2NvbcENtb9MVoWZvLcwDGTVEERbgLBfgFoz5HpSUZWnrKYzi-2t5rxpL7-WLBxeNH-WkIHz-ZGJTmArTla55CbwwVZLxHCEAEWymR08l_XufY7OEhBrPkc9AtWHHieJjN5daWwvAAPx9piCETcTF_HcqByPROCg_euDibKPYV3s6jzfe4CHDckrYc0jKsf7Yk21w&expires_in=3600&token_type=Bearer


