import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import BaseInput from '../../BaseInput';
import SelectOption from '../SelectOption';
import SelectGroup from '../SelectGroup';
import styles from './styles.scss';

export default class NativeSelect extends BaseInput {

  static propTypes = {
    ...BaseInput.propTypes,
    max: PropTypes.number,
    min: PropTypes.number,
  };

  static defaultProps = {
    ...BaseInput.defaultProps,
    render: renderSelect,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const selectedOptions = this.input.selectedOptions;

    if (selectedOptions.length > this.props.max) {
      const toRemove = selectedOptions.length - this.props.max;

      for (let i = 0; i < toRemove; i++) {
        selectedOptions[selectedOptions.length - 1].selected = false;
      }
    }

    return super.onChange(e);
  }

  getValue() {
    return Array.prototype.map.call(this.input.selectedOptions, opt => opt.value);
  }

  validate() {
    const input = this.input;

    if (this.props.min != null && input.selectedOptions.length < this.props.min) {
      return this.setValidity(false, `Please select at least ${this.props.min} items`);
    }

    if (this.props.max != null && input.selectedOptions.length > this.props.max) {
      return this.setValidity(false, `Please select at most ${this.props.max} items`);
    }

    return super.validate();
  }

  inputHasWidget() {
    return true;
  }

  getWidgetProps() {
    const props = super.getWidgetProps();

    props.children = React.Children.map(this.props.children, propToSelect);
    props.multiple = props.max > 1 || props.max == null;
    props.required = props.min > 0;

    return props;
  }
}

function propToSelect(child) {
  if (child.type === SelectOption) {
    return <option {...child.props} />;
  }

  if (child.type === SelectGroup) {
    const children = React.Children.map(child.props.children, propToSelect);
    return <optgroup {...child.props}>{children}</optgroup>;
  }

  throw new TypeError('Invalid child type');
}

function renderSelect({ widgetProps, containerProps, labelProps, errorMessageProps }) {

  return (
    <div {...containerProps}>
      <select {...widgetProps} />
      <label {...labelProps} />
      <span {...errorMessageProps} />
    </div>
  );
}
