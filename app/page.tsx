"use client";

import { useEffect, useState } from "react";
import {
  redirectToAuthCodeFlow,
  refreshAccessToken,
  TokenData,
} from "./spotify-api";

async function handleAuth() {
  try {
    console.log("Starting authentication...");
    console.log("Calling redirectToAuthCodeFlow");
    await redirectToAuthCodeFlow();
    console.log("finished redirectToAuthCodeFlow");
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}

async function checkAuth() {
  console.log("checkAuth called");
  const { access_token, refresh_token, expiration_time } = getData();
  console.log("access_token = " + access_token);
  if (
    !access_token ||
    !refresh_token ||
    !expiration_time ||
    access_token === "undefined"
  ) {
    console.log("accessToken not found! Calling handleAuth...");
    await handleAuth();
    console.log("finished handleAuth");
  }
}

async function checkAndRefreshTokenIfNeeded() {
  await checkAuth();

  const expiration_time = localStorage.getItem("expiration_time");
  const refresh_token = localStorage.getItem("refresh_token");

  if (
    expiration_time &&
    refresh_token &&
    Date.now() > Number(expiration_time)
  ) {
    console.log("Access token expired. Refreshing...");
    try {
      const newTokenData = await refreshAccessToken(refresh_token);

      const {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
        expires_in: new_expires_in,
      } = newTokenData;

      const newExpirationTime = Date.now() + new_expires_in * 1000;
      localStorage.setItem("access_token", new_access_token);
      localStorage.setItem("refresh_token", new_refresh_token);
      localStorage.setItem("expiration_time", newExpirationTime.toString());

      console.log("Access token successfully refreshed.");
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }
}

function getData() {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const expiration_time = localStorage.getItem("expiration_time");
  return { access_token, refresh_token, expiration_time };
}

export default function Home() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  useEffect(() => {
    // Function to initialize token data
    function init_data() {
      console.log("init_data called");
      const { access_token, refresh_token, expiration_time } = getData();
      if (
        !access_token ||
        !refresh_token ||
        !expiration_time ||
        access_token === "undefined"
      ) {
        console.log("inti_data: data missing: calling check auth");
        checkAuth();
      } else if (Date.now() > Number(expiration_time)) {
        console.log("token expired. calling refresh token");
        console.log("date.now = " + Date.now());
        console.log("Experation time = " + expiration_time);
        checkAndRefreshTokenIfNeeded();
      } else {
        const expires_in = Number(expiration_time) - Date.now();
        setTokenData({ access_token, refresh_token, expires_in });
        console.log("token data set");
      }
    }

    init_data();

    const intervalId = setInterval(init_data, 10000);

    // Cleanup the interval when the component is unmounted or re-rendered
    //return () => clearInterval(intervalId);
  }, []);

  if (!tokenData) {
    return (
      <div>
        <button
          onClick={checkAuth}
          style={{
            color: "black",
            backgroundColor: "white",
            padding: "10px 20px",
            fontSize: "30px",
          }}
        >
          checkAuth
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Auth Info</h1>
        <ul>
          <li>access token = {tokenData.access_token}</li>
          <li>refresh token = {tokenData.refresh_token}</li>
          <li>expires in = {tokenData.expires_in * 1000} seconds</li>
        </ul>
      </div>
    );
  }
}
