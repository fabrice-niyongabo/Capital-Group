import { RESET_USER, SET_TOKEN, SET_USER } from "store/actions/user";
import { IAction } from "types/actions";
import { IUser } from "types/user";

interface IUserReducer {
  userDetails?: IUser;
  token?: string;
}
const initialState: IUserReducer = {
  userDetails: undefined,
  token: undefined,
};

const userReducer = (
  state: IUserReducer = initialState,
  action: IAction
): IUserReducer => {
  switch (action.type) {
    case SET_USER:
      return { ...state, userDetails: action.payload };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case RESET_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
