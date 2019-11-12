import React, { FC, useEffect } from "react";
import { ApplicationState } from "../Types/types";
import { Dispatch } from "redux";
import { updateUploadProgress } from "../redux/actions";
import { connect } from "react-redux";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { store } from "../redux/store";

interface UploadProgressProps extends ApplicationState {
  updateUploadProgress: Function;
}

const UploadProgress: FC<UploadProgressProps> = props => {
  function getStartEnd() {
    const { currentPart, partSize, size } = props;

    const start = currentPart * partSize;
    const end = Math.min((currentPart + 1) * partSize, size);

    return { start, end };
  }

  function getHeaders() {
    return {
      "content-type": "multipart/form-data",
      "current-part": props.currentPart,
      "upload-id": props.uploadId
    };
  }

  const onUploadProgress = (progressEvent: ProgressEvent) => {
    if (progressEvent.lengthComputable) {
      const { total, loaded } = progressEvent;
      const percentage = ((loaded / total) * 100) / props.numParts;

      props.updateUploadProgress({
        uploaded: loaded,
        percentage: props.percentage + percentage
      });
    }
  };

  useEffect(() => {
    const { file, percentage } = props;

    console.log(props, store.getState());

    if (file && percentage < 100) {
      if ("slice" in file) {
        const { start, end } = getStartEnd();
        const headers = getHeaders();

        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", chunk, file.name);
        formData.append("type", file.type);

        try {
          sendPart({ headers, onUploadProgress }, formData);
        } catch (err) {
          console.error("Não foi possível iniciar o upload", err);
        }
      }
    }
  }, [props.currentPart]);

  useEffect(() => {
    if (props.uploadId) {
      const { file, percentage } = props;

      if (file && percentage < 100) {
        if ("slice" in file) {
          const { start, end } = getStartEnd();
          const headers = getHeaders();

          const chunk = file.slice(start, end);

          const formData = new FormData();
          formData.append("file", chunk, file.name);
          formData.append("type", file.type);

          try {
            sendPart({ headers, onUploadProgress }, formData);
          } catch (err) {
            console.error("Não foi possível iniciar o upload", err);
          }
        }
      }
    }
  }, [props.uploadId]);

  useEffect(() => {
    console.log("porcentagem foi atualizada", props);
  }, [props.percentage]);

  const sendPart = async (config: AxiosRequestConfig, formData: FormData) => {
    const response: AxiosResponse = await axios.post(
      "http://localhost:5000/upload/part",
      formData,
      config
    );

    const { currentPart } = response.data;

    props.updateUploadProgress({
      currentPart
    });
  };

  return (
    <div>
      <p>File name: {props.name}</p>
      <p>Total size: {props.size}</p>
      <p>File type: {props.type}</p>
      <p>
        Progress:{" "}
        {props.percentage.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        %
      </p>
      <p>
        Parts: {props.currentPart}/{props.numParts}
      </p>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  uploadId: state.uploadId,
  percentage: state.percentage,
  name: state.name,
  size: state.size,
  type: state.type,
  numParts: state.numParts,
  currentPart: state.currentPart,
  partSize: state.partSize,
  file: state.file,
  uploaded: state.uploaded
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateUploadProgress: (uploadInfo: any) => {
    dispatch(updateUploadProgress(uploadInfo));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadProgress);
