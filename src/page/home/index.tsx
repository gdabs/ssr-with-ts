import React from 'react';
import { Request } from 'express';
import './index.less';
interface MockData {
  [index: string]: string;
}
const mockData: MockData = {
  1: '1111',
  2: '2222',
  3: '3333',
  4: '4444',
  5: ' the advertising or promotion.',
};

interface Props {
  newsDetail: string;
}
const Home: SFC<Props> = (props: Props) => {
  return <div className="news-container">{props.newsDetail}</div>;
};
Home.getInitialProps = (req: Request) => {
  return Promise.resolve({
    newsDetail: mockData[1],
  });
};

export default Home;
