const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const https = require("https");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", function (req, res) {
  let data = req.body;
  const payload = data.events.message.text;

  https.get(
    `https://chat.synology.com/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=%22e3UnCYgHYMB33SHq4QRG3aNOkj37uI3BepeZTPgcgn1EBbuAVVpJVAMOn8aCp76j%22&payload={"text":"${payload}"}`
  );

  res.send("POST Method");
  console.log(data);
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

//
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
