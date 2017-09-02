// @flow

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { getInputEffectiveType } from '../util';
import BaseInput from '../BaseInput';

const inputsWithWidget = ['date', 'datetime-local', 'file', 'month', 'week', 'range', 'time', 'color'];

export default class Input extends BaseInput {

  static propTypes = {
    ...BaseInput.propTypes,
    optional: PropTypes.bool,
    readOnly: PropTypes.bool,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    ...BaseInput.defaultProps,
    optional: false,
    readOnly: false,
    render: renderInput,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  isTextArea() {
    return this.props.type === 'textarea';
  }

  inputHasWidget() {
    // unsupported types fallback to "text"
    const effectiveType = getInputEffectiveType(this.props.type);

    return inputsWithWidget.includes(effectiveType);
  }

  inputHasValue() {
    // hasValue will return false if input.validity.badInput is true because input.value will then return ''.
    // This is mainly the case with the "number" input.
    return this.state.hasValue || (this.input && this.input.validity.badInput);
  }

  onChange(e) {
    // for some field types [number + all time related ones], input.value returns '' if the contents does not pass
    // built-in validation.
    // fortunately, it will also set input.validity.badInput to true if it has contents that is not valid.
    this.setState({
      hasValue: this.input.value.length !== 0 || this.input.validity.badInput,
    });

    return super.onChange(e);
  }

  getValue() {
    return this.input.value;
  }

  getContainerProps() {
    const props = super.getContainerProps();

    props['aria-hidden'] = String(props['aria-hidden'] === 'true' || this.props.type === 'hidden');
    props.className = classnames(
      props.className,
      {
        'progressive-form__is-readonly': this.props.readOnly,
      },
    );

    return props;
  }

  getWidgetProps() {
    const widgetProps = super.getWidgetProps();

    widgetProps.readOnly = this.props.readOnly;
    widgetProps.required = !this.props.optional;

    if (!this.isTextArea()) {
      widgetProps.type = this.props.type;
    }

    switch (this.props.type) {
      case 'integer':
        widgetProps.type = 'number';
        widgetProps.step = this.props.step ? Math.trunc(Number(this.props.step)) : 1;
        widgetProps.pattern = this.props.pattern || '^[0-9]+$';
        break;

      case 'date':
        widgetProps.placeholder = this.props.placeholder === void 0 ? 'yyyy-mm-dd' : this.props.placeholder;
        widgetProps.pattern = this.props.pattern || '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
        break;

      case 'datetime-local':
        // 2000-01-01T00:00:00
        // 2017-06-01T08:30
        // The T is added by this class so it doesn't confuse the user.
        widgetProps.placeholder = this.props.placeholder === void 0 ? 'yyyy-mm-dd hh:mm:ss' : this.props.placeholder;
        widgetProps.pattern = this.props.pattern || '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}(:[0-9]{2}(:[0-9]{2})?)?$';
        break;

      default:
    }

    return widgetProps;
  }

  getAdditionalProps() {
    return {
      InputTag: this.isTextArea() ? 'textarea' : 'input',
    };
  }
}

function renderInput({ widgetProps, containerProps, labelProps, errorMessageProps, InputTag }) {

  return (
    <div {...containerProps}>
      <InputTag {...widgetProps} />
      <label {...labelProps} />
      <span {...errorMessageProps} />
    </div>
  );
}
