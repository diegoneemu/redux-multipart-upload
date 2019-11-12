const fs = require("fs");

class WriteStream {
  constructor(fileName) {
    this.writeStream = fs.createWriteStream(`${__dirname}/tmp.pdf`);

    this.writeStream.on("error", error => {
      console.log("ocorreu um erro na stream", error);
    });

    this.writeStream.on("finish", data => {
      console.log("a stream foi finalizada", data);
    });
  }

  write(buffer) {
    this.writeStream.write(buffer);
  }

  end() {
    this.writeStream.end();
  }
}

module.exports = WriteStream;
