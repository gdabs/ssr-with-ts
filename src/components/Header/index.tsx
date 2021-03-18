import React, { memo } from 'react';
import styles from './index.module.less';

const Header = (): JSX.Element => {
  return (
    <div className={styles.header}>
      <div className={styles.logo} />
      <div className={styles.user}>
        <span className={styles.name}>3421432</span>
      </div>
    </div>
  );
};

export default memo(Header);
