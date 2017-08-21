import React from 'react';
import styles from './styles.scss';

export default function H1(props) {
  return <p {...props} className={styles.p} />;
}
