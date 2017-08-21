import React from 'react';
import PropTypes from 'prop-types';
import Common from './Common';

export default function Radio(props) {
  return <Common {...props} type="radio" />;
}

Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.any,
};
