import { combineReducers } from "redux";
import userReducer from "./user";
import appReducer from "./app";

const rootReducer = combineReducers({
  appReducer,
  userReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
