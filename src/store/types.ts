export interface Action<T> {
  readonly type: string;
  readonly payload: T;
  error?: boolean;
  meta?: any;
}

export interface ActionCreator<T> {
  readonly type: string;
  (payload?: T): Action<T>;
}
