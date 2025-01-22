Hello!

I was struggling to figure out a good way to get authorization, save necessary data in local storage, and refresh tokens when necessary on my own web app. 
This is my test app that has all that figured out!

# Spotify-API
This document holds the following functions:
 - redirect the user to the authorization page (and get auth)
 - get the token data I wanted (access token, refresh token, expiration time)
 - refresh a token 


# callback page
After a user is redirected to the authorization page, it will return you to a specified callback page. On that callback page, an authorization code will be stored in the browser's URL. My getTokenData function grabs that AUTH_CODE and uses it to get the data we need. NOTE: if the page changes before the data is saved, the AUTH_CODE will disappear. So make sure you get that data saved before redirecting the user back to a page. 

My callback page gets the AUTH_CODE, calls getTokenData, saves the data in local storage, and then redirects the user back to the home page.

NOTE!!: for testing purposes, it is coded that the access_token expires in 30 seconds. Modify the calculation that saves the expiration time correctly.


# home page ("/")
There is a lot that this page does. The functions it contains are: 
 - checkout: checks if there missing or invalid data, calls handleth
 - handleth: directs the user through the authentication process
 - checkAndRefreshTokenIfNeeded: checks when the access token expires. If expires, refresh the token
 - getData : grabs and returns access_token, refresh_token, expiration_time from local storage

For testing purposes, this page displays the necessary data on the screen. it starts by calling init_data and repeadidly calls init_data every 10 seconds. Since the token thinks it expires every 30 seconds, you should see the access token update over time.  

With this access token, you can make calls to Spotify API for any data you want. Just remember to update the permission scope as needed. Also remember to put your client id in the api file! 


# Links
Spotify API: https://developer.spotify.com/documentation/web-api

PKCE : https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

Refresh Token: https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens