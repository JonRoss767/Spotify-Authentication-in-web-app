"use client";

import { useEffect, useState } from "react";
import {
  redirectToAuthCodeFlow,
  getTokenData,
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
  const accessToken = localStorage.getItem("access_token");
  console.log("accessToken = " + accessToken);
  if (!accessToken || accessToken === "undefined") {
    console.log("accessToken not found! Calling handleAuth...");
    await handleAuth();
    console.log("finished handleAuth");
  }
}

async function checkAndRefreshTokenIfNeeded() {
  const expirationTime = localStorage.getItem("expiration_time");
  const refreshTokenValue = localStorage.getItem("refresh_token");

  if (
    expirationTime &&
    refreshTokenValue &&
    Date.now() > Number(expirationTime)
  ) {
    console.log("Access token expired. Refreshing...");
    try {
      const newTokenData = await refreshAccessToken(refreshTokenValue);

      const { access_token, refresh_token, expires_in } = newTokenData;

      const newExpirationTime = Date.now() + expires_in * 1000;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expiration_time", newExpirationTime.toString());

      console.log("Access token successfully refreshed.");
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }
}

export default function Home() {
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
}
