import PropTypes from 'prop-types';
import React from 'react';
import ButtonAbstract from '../ButtonAbstract';

export default function Button(props) {

  const { children, ...otherProps } = props;

  delete otherProps.onValidityChange;

  return <ButtonAbstract {...otherProps}>{children}</ButtonAbstract>;
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
