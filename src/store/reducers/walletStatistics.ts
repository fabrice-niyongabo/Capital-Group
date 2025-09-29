import {
  SET_IS_LOADING_WALLET_STATISTICS,
  SET_WALLET_STATISTICS,
} from "store/actions/walletStatistics";
import { IAction } from "types/actions";
import { IStatistics } from "types/statistics";

interface IStatisticsReducer {
  isLoading: boolean;
  statistics: IStatistics | null;
}
const initialState: IStatisticsReducer = {
  isLoading: false,
  statistics: null,
};

const statisticsReducer = (
  state: IStatisticsReducer = initialState,
  action: IAction
): IStatisticsReducer => {
  switch (action.type) {
    case SET_WALLET_STATISTICS:
      return { ...state, statistics: action.payload };
    case SET_IS_LOADING_WALLET_STATISTICS:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default statisticsReducer;
