import React from 'react';
import styles from './styles.scss';

export default function P(props) {
  return <p {...props} className={styles.p} />;
}
