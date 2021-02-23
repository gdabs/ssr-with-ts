import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { setLanguage, Language } from '@/store/module/app';
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
  setLanguage: (language: Language) => void;
  language: Language;
}
const Home: SFC<Props> = (props: Props) => {
  const { newsDetail, language, setLanguage } = props;

  const switchLanguage = useCallback(() => {
    setLanguage(language === 'zhCN' ? 'en' : 'zhCN');
  }, [setLanguage, language]);
  return (
    <div className="news-container">
      <div>{newsDetail}</div>
      <div onClick={switchLanguage}>{language}</div>
    </div>
  );
};
Home.getInitialProps = req => {
  return Promise.resolve({
    newsDetail: mockData[1],
  });
};

export default connect(({ app }: StoreState) => ({ language: app.language }), {
  setLanguage,
})(Home);
