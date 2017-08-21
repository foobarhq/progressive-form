import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import AbstractField from '../AbstractField';
import { CHARCODES, generateIdentifier } from '../util';
import styles from './styles.scss';

export default class RadioCheckbox extends AbstractField {

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.any,
    type: PropTypes.string.isRequired,
    optional: PropTypes.bool,
  };

  constructor() {
    super();

    this.id = generateIdentifier();

    this.onLabelKeyUp = this.onLabelKeyUp.bind(this);
    this.bindNativeCheckBox = this.bindNativeCheckBox.bind(this);
  }

  onLabelKeyUp(e) {
    if (this.input && (e.keyCode === CHARCODES.ENTER || e.keyCode === CHARCODES.SPACE)) {
      this.input.click();
    }
  }

  bindNativeCheckBox(input) {
    this.input = input;
  }

  focus() {
    return this.input && this.input.focus;
  }

  isDefaultOptional() {
    // radio buttons are default required
    return this.props.type === 'checkbox';
  }

  render() {
    const { label, optional = this.isDefaultOptional(), ...props } = this.props;

    return (
      <label // eslint-disable-line
        onKeyUp={this.onLabelKeyUp}
        htmlFor={this.id}
        className={classnames(this.props.className, styles.checkboxLabel, {
          [styles.isDisabled]: props.disabled,
        })}
      >
        <input
          tabIndex={0}
          ref={this.bindNativeCheckBox}

          {...props}

          id={this.id}
          type={this.props.type}
          className={styles.checkbox}
          required={!optional}
        />
        <span className={styles.fakeCheckbox} aria-hidden="true" />

        {label}
      </label>
    );
  }
}
