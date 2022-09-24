import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "../../Utils/Config";
import AuthHandler from "../../Utils/AuthHandler";

export default function GetData() {
  const token = AuthHandler.getLoginToken();
  const body = { hello: "hello" };
  const [location, setLocation] = useState({ states: [{}] });
  useEffect(() => {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.location, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        setLocation(response.data);
      });
  });
  console.log(location);
  return { location };
}
