import React from 'react';
import classnames from 'classnames';
import AbstractField from '../../AbstractField';
import SelectOption from '../SelectOption';
import SelectGroup from '../SelectGroup';
import styles from './styles.scss';

/* eslint-disable react/prop-types */

export default class NativeSelect extends AbstractField {

  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.bindField = this.bindField.bind(this);
  }

  onChange(e) {
    const selectedOptions = e.target.selectedOptions;

    if (selectedOptions.length > this.props.max) {
      const toRemove = selectedOptions.length - this.props.max;

      for (let i = 0; i < toRemove; i++) {
        selectedOptions[selectedOptions.length - 1].selected = false;
      }
    }

    if (this.props.onChange) {
      this.props.onChange({
        value: Array.prototype.map.call(selectedOptions, opt => opt.value),
        name: this.props.name,
      });
    }
  }

  bindField(field) {
    this.field = field;
  }

  focus() {
    if (this.field && this.field.focus) {
      this.field.focus();
    }
  }

  validate() {
    const input = this.input;

    input.setCustomValidity('');

    if (!input.checkValidity()) {
      this.setValidity(false);
      return false;
    }

    // TODO is this correct?
    if (input.value.length === 0) {
      this.setValidity(true);
      return true;
    }

    this.setValidity(true);
    return true;
  }

  render() {
    const props = this.props;
    const options = React.Children.map(props.children, propToSelect);

    return (
      <select
        {...props}
        ref={this.bindField}
        autoFocus={props.autoFocus}
        disabled={props.disabled}
        name={props.name}
        className={classnames(styles.select, styles['select--dropdown'], props.className)}
        multiple={props.max > 1 || props.max == null}
        required={props.min > 0}
        onChange={this.onChange}
      >
        {options}
      </select>
    );
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
