interface Window {
  __USE_SSR__?: string;
  __INITIAL_DATA__?: any;
  __REDUX_DEVTOOLS_EXTENSION__: Function;
  _store: any;
}
interface NodeModule {
  hot?: Hot;
}
interface Hot {
  accept(path?: string): void;
}
declare const __isBrowser__: boolean;

interface SFC<P> extends React.FC<P> {
  getInitialProps?(object, object): Promise<any>;
}
