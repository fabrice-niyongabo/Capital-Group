import {Action, UnknownAction} from 'redux';

export interface IAction extends UnknownAction {
  type: string;
  payload: any;
}
