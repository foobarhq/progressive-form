import React from 'react';
import styles from './styles.scss';

export default function Li(props) {
  return <li {...props} className={styles.li} />;
}
