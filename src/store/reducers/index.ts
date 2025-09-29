import { combineReducers } from "redux";
import userReducer from "./user";
import appReducer from "./app";
import statisticsReducer from "./walletStatistics";

const rootReducer = combineReducers({
  appReducer,
  userReducer,
  statisticsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
