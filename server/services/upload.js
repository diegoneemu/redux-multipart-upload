const WriteStream = require("./write-file-stream");

class UploadService {
  constructor() {
    this._files = {};
    this._partSize = 10 * 1024 * 1024;
  }

  get files() {
    return this._files;
  }

  addFile(file) {
    this._files[file.uploadId] = file;

    let type = "txt";

    this._files[file.uploadId].stream = new WriteStream(file.uploadId, "pdf");

    console.log();
  }

  removeFile(file) {
    const currentFile = this._files[file.uploadId];
    let removed = false;

    if (currentFile && currentFile.complete) {
      delete this._files[file.uploadId];
      removed = true;
    }

    return removed;
  }

  completeFile(file) {
    this._files[file.uploadId].complete = true;
  }

  getMetaInfo(uploadId) {
    const file = this._files[uploadId];

    file.currentPart = 0;
    file.percentage = 0;
    file.numParts = Math.ceil(file.size / this._partSize);

    return { ...file, partSize: this._partSize };
  }
}

module.exports = new UploadService();
