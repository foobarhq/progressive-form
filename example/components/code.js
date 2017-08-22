import React from 'react';
import styles from './styles.scss';

export default function Code(props) {
  return <code {...props} className={styles.code} />;
}
