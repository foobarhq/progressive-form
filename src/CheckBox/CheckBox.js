import React from 'react';
import PropTypes from 'prop-types';
import Common from './Common';

export default function CheckBox(props) {
  return <Common {...props} type="checkbox" />;
}

CheckBox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.any,
};
