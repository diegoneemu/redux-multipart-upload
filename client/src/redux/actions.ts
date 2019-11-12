import { ApplicationState } from "../Types/types";

export type Actions = {
  type: Action;
  payload: any;
};

export enum Action {
  ADD_FILE = "add-file",
  UPDATE_UPLOAD_PROGRESS = "update-uplaod-progress",
  SEND_PART = "send-part",
  COMPLETE_UPLOAD = "complete"
}

export const addFile = (file: ApplicationState) => ({
  type: Action.ADD_FILE,
  payload: file
});

export const updateUploadProgress = (uploadInfo: any) => ({
  type: Action.UPDATE_UPLOAD_PROGRESS,
  payload: uploadInfo
});

export const sendPart = (part: any) => ({
  type: Action.SEND_PART,
  payload: part
});

export const completeUpload = (part: any) => ({
  type: Action.COMPLETE_UPLOAD,
  payload: part
});

export const sendPart2 = async (currentPart: number, partSize: number) => {};
