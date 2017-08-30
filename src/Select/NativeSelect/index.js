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
    this.onFocus = this.onFocus.bind(this);
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

    if (
      // revalidate if was invalid and cancel onChange if still invalid
      (this.isValid() || this.validate())
      && this.props.onChange
    ) {
      this.props.onChange({
        value: Array.prototype.map.call(selectedOptions, opt => opt.value),
        name: this.props.name,
      });
    }
  }

  onFocus(e) {
    this.setActive();

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  bindField(field) {
    this.field = field;
  }

  focus() {
    this.setActive();

    if (this.field && this.field.focus) {
      this.field.focus();
    }
  }

  validate() {
    const field = this.field;

    field.setCustomValidity('');

    if (!field.checkValidity()) {
      return this.setValidity(false, field.validationMessage);
    }

    if (this.props.min != null && field.selectedOptions.length < this.props.min) {
      return this.setValidity(false, `Please select at least ${this.props.min} items`);
    }

    if (this.props.max != null && field.selectedOptions.length > this.props.max) {
      return this.setValidity(false, `Please select at most ${this.props.max} items`);
    }

    return this.setValidity(true);
  }

  setValidity(valid, message = '') {
    if (!valid) {
      // use native system to block submit events.
      this.field.setCustomValidity(message);
    } else {
      this.field.setCustomValidity('');
    }

    return super.setValidity(valid, message);
  }

  render() {
    const props = this.props;
    const options = React.Children.map(props.children, propToSelect);

    return (
      <div
        className={classnames(
          props.className,
          styles.selectContainer,
          styles['select--dropdown'],
          this.getCommonFieldClassName(),
        )}
        aria-hidden={this.props.type === 'hidden' ? 'true' : 'false'}
      >
        <select
          {...props}
          ref={this.bindField}
          className={styles.select}
          multiple={props.max > 1 || props.max == null}
          required={props.min > 0}
          onChange={this.onChange}
          onFocus={this.onFocus}

          aria-invalid={this.isValid() ? 'false' : 'true'}
        >
          {options}
        </select>
        <span className={styles.selectMessage}>{this.state.message}</span>
      </div>
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
