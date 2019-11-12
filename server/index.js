const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const http = require("http");
const querystring = require("querystring");

const routesDir = path.join(__dirname, "routes");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
app.use(fileUpload());

const server = http.Server(app);

server.listen(5000, err => {
  if (err) {
    console.err(err);
    process.exit(1);
  }

  console.log(routesDir);

  fs.readdirSync(routesDir).map(file => {
    const route = path.join(routesDir, file);

    app.use("/", require(route)(app));
  });

  console.log("server listening on port 5000");
});
