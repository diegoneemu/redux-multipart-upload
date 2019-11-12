const uploadService = require("../services/upload");

const partSize = 5 * 1024;

module.exports = {
  initUpload: (req, res) => {
    const file = { ...req.body };

    uploadService.addFile(file);

    const metaInfo = uploadService.getMetaInfo(file.uploadId);

    res.status(200).send(metaInfo);

    res.on("finish", () => {
      console.log("receive response ", res.statusCode);
    });
  },

  sendPart: (req, res) => {
    const { headers, body, files } = req;
    const uploadId = headers["upload-id"];

    uploadService.files[uploadId].stream.write(files.file.data);

    res.status(200).send({
      currentPart: ++headers["current-part"],
      uploadId: headers["upload-id"]
    });
  }
};
