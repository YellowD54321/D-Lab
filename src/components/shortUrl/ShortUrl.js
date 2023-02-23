import axios from "axios";
import React, { useState, useEffect } from "react";

const REURL_ACCESS_KEY =
  "4070ff49d794eb35184b3511209a214de0d5b5328d896494ab38acc62b055f6689";
const REURL_API_ENDPOINT = "https://api.reurl.cc/shorten";
const DOMAIN = "http://xonxor.com/pos";

const ShortUrl = () => {
  const [shortUrl, setShortUrl] = useState("");

  useEffect(() => {
    const getInitialData = async () => {
      const headers = {
        "reurl-api-key": REURL_ACCESS_KEY,
      };
      const body = {
        url: DOMAIN,
      };
      const response = await axios.post(REURL_API_ENDPOINT, body, {
        headers,
      });
      console.log("response", response);
      const data = response.data;
      const shortUrl = data.short_url;
      setShortUrl(shortUrl);
    };
    getInitialData();
  }, []);

  return <div>short url: {shortUrl}</div>;
};

export default ShortUrl;
