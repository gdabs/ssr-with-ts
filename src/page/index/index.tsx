import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';

interface Props {
  news: NewsItem[];
}
interface NewsItem {
  id: string;
  title: string;
}

const Page: SFC<Props> = (props: Props): JSX.Element => {
  return (
    <div className="normal">
      <div className="welcome" />
      <ul className="list">
        {props.news &&
          props.news.map((item: NewsItem) => (
            <li key={item.id}>
              <div>文章标题: {item.title}</div>
              <div className="toDetail">
                <Link to="home">点击查看详情</Link>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

Page.getInitialProps = req => {
  return Promise.resolve({
    news: [
      {
        id: '1',
        title: 'Racket v7.3 Release Notes',
      },
      {
        id: '2',
        title: 'Free Dropbox Accounts Now Only Sync to Three Devices',
      },
      { id: '3', title: 'Voynich Manuscript Decoded by Bristol Academic' },
      { id: '4', title: 'Burger King to Deliver Whoppers to LA Drivers Stuck in Traffic' },
      { id: '5', title: 'How much do YouTube celebrities charge to advertise your product? ' },
    ],
  });
};
export default Page;
