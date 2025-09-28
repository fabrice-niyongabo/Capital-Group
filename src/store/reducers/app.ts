import { SET_SHOW_LOGIN } from "store/actions/app";
import { IAction } from "types/actions";

interface IAppReducer {
  showLogin: boolean;
}
const initialState: IAppReducer = {
  showLogin: false,
};

const appReducer = (
  state: IAppReducer = initialState,
  action: IAction
): IAppReducer => {
  switch (action.type) {
    case SET_SHOW_LOGIN:
      return { ...state, showLogin: action.payload };
    default:
      return state;
  }
};

export default appReducer;
