import { IAction } from "types/actions";
import { IUser } from "types/user";

export const SET_USER = "SET_USER";
export const SET_TOKEN = "SET_TOKEN";
export const RESET_USER = "RESET_USER";

export const setUser = (user: IUser): IAction => ({
  type: SET_USER,
  payload: user,
});

export const setToken = (token: string): IAction => ({
  type: SET_TOKEN,
  payload: token,
});

export const resetUser = () => ({ type: RESET_USER });
