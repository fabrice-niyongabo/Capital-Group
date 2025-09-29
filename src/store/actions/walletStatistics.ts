import axios from "axios";
import { APP_CONFIG } from "lib/constants";
import { errorHandler, setAuthHeaders } from "lib/util";
import { RootState } from "store/reducers";
import { IAction } from "types/actions";
import { IStatistics } from "types/statistics";

export const SET_WALLET_STATISTICS = "SET_WALLET_STATISTICS";
export const SET_IS_LOADING_WALLET_STATISTICS =
  "SET_IS_LOADING_WALLET_STATISTICS";

export const setIsLoadingWalletStatistics = (isLoading: boolean): IAction => ({
  type: SET_IS_LOADING_WALLET_STATISTICS,
  payload: isLoading,
});

export const setWalletStatistics = (stats: IStatistics): IAction => ({
  type: SET_WALLET_STATISTICS,
  payload: stats,
});

export const fetchStatistics =
  (): any => async (dispatch: any, getState: any) => {
    try {
      const { userReducer } = getState() as RootState;
      dispatch(setIsLoadingWalletStatistics(true));
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/user/stats`,
        setAuthHeaders(userReducer.token || "")
      );
      dispatch(setWalletStatistics(res.data));
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setIsLoadingWalletStatistics(false));
    }
  };
