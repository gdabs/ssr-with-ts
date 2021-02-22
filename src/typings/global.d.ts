interface Window {
  __USE_SSR__?: string;
  __INITIAL_DATA__?: any;
}
interface NodeModule {
  hot?: Hot;
}
interface Hot {
  accept(path?: string): void;
}
declare const __isBrowser__: boolean;

interface SFC<P> extends React.SFC<P> {
  getInitialProps?(object): Promise<any>;
}
