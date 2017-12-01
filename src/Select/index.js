import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from '../prop-types';
import SelectOption from './SelectOption';
import SelectGroup from './SelectGroup';
import NativeSelect from './NativeSelect';
import NativeBoxes from './NativeBoxes';

export default function Select(props) {

  if (process.env.NODE_ENV === 'development') {
    if (props.min > props.max) {
      throw new TypeError(`Invalid value for Select.props.min or Select.props.max: min is above max (min: ${props.min} > max: ${props.max})`);
    }

    if (props.min < 0) {
      throw new TypeError(`Invalid value for Select.props.min: must be above or equal to 0 (${props.min})`);
    }

    if (props.max < 1) {
      throw new TypeError(`Invalid value for Select.props.max: must be above or equal to 1 (${props.max})`);
    }
  }

  const { ui, ...otherProps } = props;

  switch (ui) {
    case Select.UI_DROPDOWN:
      return <NativeSelect {...otherProps} />;

    case Select.UI_BOXES:
    default:
      return <NativeBoxes {...otherProps} />;
  }
}

Select.UI_DROPDOWN = 0;
Select.UI_BOXES = 1;

/* eslint-disable react/no-unused-prop-types */
Select.propTypes = {
  ui: PropTypes.oneOf([
    Select.UI_DROPDOWN,
    Select.UI_BOXES,
  ]),
  max: PropTypes.number,
  min: PropTypes.number,
  children: CustomPropTypes.component(SelectGroup, SelectOption),

  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  form: PropTypes.string,
};
/* eslint-enable react/no-unused-prop-types */

Select.defaultProps = {
  ui: Select.UI_DROPDOWN,
  max: Number.POSITIVE_INFINITY,
  min: 1,
};
