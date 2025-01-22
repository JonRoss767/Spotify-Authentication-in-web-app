"use client";

import { useEffect } from "react";
import { getTokenData } from "../spotify-api";

export default function callbackPage() {
  useEffect(() => {
    async function init() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log("AUTH_CODE = " + code);
      if (!code) {
        throw new Error("Authorization code not found in the URL.");
      }

      console.log("Calling getTokenData");
      const { access_token, refresh_token, expires_in } = await getTokenData(
        code
      );
      console.log("Finished getTokenData");
      console.log("access_token" + access_token);
      console.log("refresh_token" + refresh_token);
      console.log("expires_in" + expires_in);

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in.toString());
      window.location.href = "/";
    }

    init();
  }, []);

  return <h1>Redirecting...</h1>;
}
