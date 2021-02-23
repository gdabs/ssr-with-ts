import { assign } from 'lodash';
import { Action, ActionCreator } from './types';

export const actionCreator = <T>(type: string): ActionCreator<T> =>
  assign((payload?: T) => ({ type, payload }), { type });

export const isType = <T>(
  action: Action<any>,
  actionCreator: ActionCreator<T>
): action is Action<T> => action.type === actionCreator.type;

export function updateState<StateType>(
  oldValue: StateType,
  newValue: Partial<StateType>
): StateType {
  return assign({}, oldValue, newValue);
}
