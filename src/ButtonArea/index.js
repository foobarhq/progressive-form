import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import ButtonAbstract from '../ButtonAbstract';
import styles from './styles.scss';

export default function ButtonArea(props) {
  const { children, className, ...otherProps } = props;

  return (
    <ButtonAbstract{...otherProps} className={classnames(className, styles.buttonArea)}>{children}</ButtonAbstract>
  );
}

ButtonArea.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
