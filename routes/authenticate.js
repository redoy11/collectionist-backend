require('dotenv').config()
const FormData = require("form-data");
const fetch = require("node-fetch");

var express = require('express');
var router = express.Router();

router.post("/", (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", process.env.GITHUB_CLIENT_ID);
  data.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
  data.append("code", code);

  // Request to exchange code for an access token
  fetch(process.env.GITHUB_OAUTH_ENDPOINT, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");

      // Request to return data of a user that has been authenticated
      return res.status(200).json(access_token);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

module.exports = router;
