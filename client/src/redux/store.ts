import { createStore } from "redux";
import { ApplicationState } from "../Types/types";
import { Actions, Action } from "./actions";

const reducer = (
  state: ApplicationState = {
    percentage: 0,
    currentPart: 0,
    partSize: 0,
    size: 0,
    uploaded: 0,
    numParts: 0
  },
  action: Actions
): ApplicationState => {
  switch (action.type) {
    case Action.ADD_FILE:
      return { ...state, ...action.payload };
    case Action.UPDATE_UPLOAD_PROGRESS:
      return { ...state, ...action.payload };
    case Action.SEND_PART:
      return state;
    case Action.COMPLETE_UPLOAD:
      return state;
  }

  return state;
};

export const store = createStore(reducer);
