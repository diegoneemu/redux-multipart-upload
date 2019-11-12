const express = require("express");
const uploadController = require("../controllers/upload");

module.exports = app => {
  const Route = express.Router({ mergeParams: true });

  Route.route("/upload").post(uploadController.initUpload);
  Route.route("/upload/part").post(uploadController.sendPart);

  return Route;
};
