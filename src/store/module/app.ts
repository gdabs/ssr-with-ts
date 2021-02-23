import { Reducer } from 'redux';
import { actionCreator } from '../utils';
import { Action, ActionCreator } from '../types';

export type Language = 'zhCN' | 'en';
type Size = 'small' | 'medium' | 'large';

// state interface
export interface AppState {
  sidebar: { opened: boolean; withoutAnimation: boolean };
  device: string;
  language: Language;
  size: Size;
}

// default state
const defaultApp: AppState = {
  sidebar: {
    opened: true,
    withoutAnimation: false,
  },
  device: 'desktop',
  language: 'en',
  size: 'medium',
};

// actions
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';
const TOGGLE_DEVICE = 'TOGGLE_DEVICE';
const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_SIZE = 'SET_SIZE';

export const toggleSideBar = actionCreator(TOGGLE_SIDEBAR);
export const closeSideBar: ActionCreator<boolean> = actionCreator<boolean>(CLOSE_SIDEBAR);
export const toggleDevice: ActionCreator<String> = actionCreator<String>(TOGGLE_DEVICE);
export const setLanguage: ActionCreator<Language> = actionCreator<Language>(SET_LANGUAGE);
export const setSize: ActionCreator<Size> = actionCreator<Size>(SET_SIZE);

// 后续由于可能写成异步的故用react-thunk的方式写成这样
// export const logout = () => {
//   return (dispatch: Dispatch) => {
//     dispatch({
//       type: SET_USER_LOGOUT,
//       payload: null,
//     });
//   };
// };

// reducers
const appReducer: Reducer<AppState, Action<any>> = (state = defaultApp, action: Action<any>) => {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_SIDEBAR:
      const opened = !state.sidebar.opened;
      return {
        ...state,
        sidebar: { ...state.sidebar, opened, withoutAnimation: false },
      };
    case CLOSE_SIDEBAR:
      return {
        ...state,
        sidebar: { ...state.sidebar, opened: false, withoutAnimation: !!payload },
      };
    case TOGGLE_DEVICE:
      return {
        ...state,
        device: payload,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        language: payload,
      };
    case SET_SIZE:
      return {
        ...state,
        size: payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default appReducer;
