import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import AbstractField from '../AbstractField';
import { generateIdentifier } from '../util';
import styles from './styles.scss';

const propBlackList = ['validator', 'optional', 'label', 'onValidityChange'];

export default class Input extends AbstractField {

  /* eslint-disable */
  static propTypes = {
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,

    /**
     * @param {!String} inputValue - The value of the input/textarea.
     * @return {!(String|boolean)} True if the input is valid, an error message otherwise.
     */
    validator: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onValidityChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    optional: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
  };
  /* eslint-enable */

  static defaultProps = {
    optional: false,
    validator() {
      return true;
    },
  };

  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.bindInput = this.bindInput.bind(this);

    this.initStatePart({
      message: '',
      focus: false,
      hasValue: Boolean(props.value),
    });

    this.lastReceivedValue = props.value;
    this.mutableProps = {};
    this.overrideProps(props);
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.props.autoFocus) {
      this.focus();
    }
  }

  componentWillReceiveProps(props, context) {
    super.componentWillReceiveProps(props, context);

    if (props.value !== this.lastReceivedValue) {
      this.lastReceivedValue = props.value;
      this.setState({
        hasValue: Boolean(props.value),
      });
    }

    this.overrideProps(props);
  }

  overrideProps(props) {
    const mutableProps = this.mutableProps;
    Object.assign(mutableProps, props);

    if (!mutableProps.id) {
      mutableProps.id = generateIdentifier();
    }

    if (mutableProps.type === 'integer') {
      mutableProps.type = 'number';

      if (mutableProps.step) {
        mutableProps.step = Math.round(Number(mutableProps.step));
      } else {
        mutableProps.step = 1;
      }

      if (!mutableProps.pattern) {
        mutableProps.pattern = '^[0-9]+$';
      }
    } else if (mutableProps.type === 'date') {
      mutableProps.placeholder = mutableProps.placeholder || 'yyyy-mm-dd';
      mutableProps.pattern = mutableProps.pattern || '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
    }

    this.isTextArea = mutableProps.type === 'textarea';
    if (this.isTextArea) {
      delete mutableProps.type;
    }

    this.inputProps = Object.assign({}, mutableProps);
    for (const blacklistedKey of propBlackList) {
      delete this.inputProps[blacklistedKey];
    }
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }

    this.setState({ focus: true });
  }

  onBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }

    this.setState({ focus: false });
  }

  onChange(e) {
    const input = this.input;

    // for some field types [number + all time related ones], input.value returns '' if the contents does not pass
    // built-in validation.
    // fortunately, it will also set input.validity.badInput to true if it has contents that is not valid.
    this.setState({
      hasValue: input.value.length !== 0 || input.validity.badInput,
    });

    let valid = this.isValid();

    input.setCustomValidity('');
    if (input.validity.valid) {
      this.setValidity(true);
      valid = true;
    }

    if (valid && this.props.onChange) {
      this.props.onChange(e);
    }
  }

  onInvalid(event) {
    event.preventDefault();

    this.setValidity(false, event.target.validationMessage, false);
  }

  bindInput(instance) {
    this.input = instance;
  }

  focus() {
    if (!this.input) {
      return false;
    }

    this.input.focus();

    return true;
  }

  validate() {
    const input = this.input;
    const validator = this.mutableProps.validator;

    // e => sendChangesWithDelay(e.target, validator, this)
    input.setCustomValidity('');

    if (!input.checkValidity()) {
      this.setValidity(false, input.validationMessage);
      return false;
    }

    if (input.value.length === 0) {
      this.setValidity(true);
      return true;
    }

    const validity = validator(input.value);

    if (validity === true) {
      this.setValidity(true, '');
      return true;
    } else if (validity === false) {
      this.setValidity(false, '');
      return false;
    }

    this.setValidity(validity.valid, validity.message);
    return validity.valid;
  }

  setValidity(valid, message = '', setNative = true) {
    if (setNative) {
      if (!valid) {
        // use native system to block submit events.
        this.input.setCustomValidity(message);
      } else {
        this.input.setCustomValidity('');
      }
    }

    super.setValidity(valid, message);
  }

  render() {
    const InputTag = this.isTextArea ? 'textarea' : 'input';
    const filled = this.state.hasValue || this.inputProps.type === 'date';

    const containerClassName = classnames(
      styles.inputContainer,
      this.mutableProps.className || '',
      this.getCommonFieldClassName(),
      {
        [styles.isInvalid]: !this.isValid(),
        [styles.hasFocus]: this.state.focus,
        [styles.isFilled]: filled,
        [styles.isDisabled]: this.inputProps.disabled,
        [styles.isReadonly]: this.inputProps.readOnly,
      }
    );

    return (
      <div className={containerClassName} aria-hidden={this.props.type === 'hidden' ? 'true' : 'false'}>
        <InputTag
          {...this.inputProps}

          ref={this.bindInput}
          className={styles.input}
          required={!this.mutableProps.optional}

          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onInvalid={this.onInvalid}

          aria-invalid={this.isValid() ? 'false' : 'true'}
        />
        <label className={styles.inputLabel} htmlFor={this.inputProps.id}>{this.mutableProps.label}</label>
        <span className={styles.inputMessage}>{this.state.message}</span>
      </div>
    );
  }
}
