import { IAction } from "types/actions";

export const SET_SHOW_LOGIN = "SET_SHOW_LOGIN";

export const setShowLogin = (showLogin: boolean): IAction => ({
  type: SET_SHOW_LOGIN,
  payload: showLogin,
});
