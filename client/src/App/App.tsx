import axios, { AxiosResponse } from "axios";
import React, { DragEvent, MouseEvent, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import uuid from "uuidv4";
import { addFile as addFileToUpload } from "../redux/actions";
import "./App.css";
import { ApplicationState } from "../Types/types";
import UploadProgress from "../UploadProgress";

interface AppProps extends ApplicationState {
  addFile: Function;
}

const App: React.FC<AppProps> = props => {
  const [files, setFiles] = useState<File | null>(null);

  let uploadFileInput: HTMLInputElement | null = null;

  const overrideEventDefaults = (event: Event | DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    overrideEventDefaults(event);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFiles(event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0])
      setFiles(event.target.files[0]);
  };

  const sendFiles = async (event: MouseEvent) => {
    if (files) {
      const { name, size, type } = files;

      const uploadId = uuid();

      const fileInfo = {
        uploadId,
        name,
        type,
        size
      };

      try {
        const response: AxiosResponse = await axios.post(
          "http://localhost:5000/upload/",
          fileInfo
        );

        const { currentPart, percentage, partSize, numParts } = response.data;

        props.addFile({
          ...fileInfo,
          currentPart,
          percentage,
          partSize,
          numParts,
          file: files
        });
      } catch (err) {
        console.error("Não foi possível iniciar o upload", err);
      }
    }
  };

  return (
    <div className="App">
      <UploadProgress />
      <header className="App-header">
        <div
          id="fileToUpload"
          onDrop={handleDrop}
          onClick={() => uploadFileInput && uploadFileInput.click()}
          onDrag={overrideEventDefaults}
          onDragStart={overrideEventDefaults}
          onDragEnd={overrideEventDefaults}
          onDragOver={overrideEventDefaults}
          style={{
            backgroundColor: "white",
            borderColor: "3px solid pink",
            borderRadius: "5px",
            color: "black",
            padding: "30px",
            cursor: "pointer"
          }}
        >
          {files && (
            <span className="file-uploader__file-name">{files.name}</span>
          )}
          <br />
          <span>Drag & Drop File</span>
          <br />
          <span>or</span>
          <br />
          <span>Click here to Select a File</span>
          <br />
          <input
            type="file"
            hidden
            ref={(el: HTMLInputElement) => (uploadFileInput = el)}
            onChange={handleChange}
          />
        </div>
        <input type="button" value="enviar arquivo" onClick={sendFiles} />
      </header>
    </div>
  );
};

const mapStateToProps = (store: ApplicationState) => ({
  uploadId: store.uploadId,
  percentage: store.percentage,
  fileName: store.name,
  size: store.size,
  type: store.type,
  numParts: store.numParts,
  currentPart: store.currentPart,
  file: store.file,
  partSize: store.partSize,
  uploaded: store.uploaded
});

const mapDispatchToProps = (dispach: Dispatch) => ({
  addFile: (file: ApplicationState) => {
    dispach(addFileToUpload(file));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
