// @flow

import classnames from 'classnames';
import PropTypes from 'prop-types';
import { generateIdentifier } from '../util';
import AbstractField from '../AbstractField';

const widgetPropBlacklist = ['validator', 'render', 'label', 'optional'];

export default class BaseInput extends AbstractField {

  static propTypes = {
    ...AbstractField.propTypes,

    /**
     * @param {!String} inputValue - The value of the input/textarea.
     * @return {!(String|boolean)} True if the input is valid, an error message otherwise.
     */
    validator: PropTypes.func,
    render: PropTypes.func,
    onValidityChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,

    value: PropTypes.string,
    disabled: PropTypes.bool,

    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
  };

  static defaultProps = {
    validator() {
      return true;
    },
  };

  get generatedIdentifier(): string {
    const identifier = generateIdentifier();

    Object.defineProperty(this, 'generatedIdentifier', {
      value: identifier,
    });

    return identifier;
  }

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
      hasValue: Boolean(props.value) || Boolean(props.defaultValue),
    });
  }

  componentWillReceiveProps(props, context) {
    super.componentWillReceiveProps(props, context);

    if (props.value !== this.lastReceivedValue) {
      this.lastReceivedValue = props.value;
      this.setState({
        hasValue: Boolean(props.value),
      });
    }
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.props.autoFocus) {
      this.focus();
    }
  }

  getId() {
    return this.props.id || this.generatedIdentifier;
  }

  focus() {
    if (!this.input) {
      return false;
    }

    this.input.focus();
    this.onFocus(null);

    return true;
  }

  blur() {
    if (!this.input) {
      return false;
    }

    this.input.focus();
    this.onBlur(null);

    return true;
  }

  validate() {
    const input = this.input;
    const validator = this.props.validator;

    input.setCustomValidity('');

    if (!input.checkValidity()) {
      this.setValidity(false, input.validationMessage);
      return false;
    }

    console.log(input.value.length);
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

  setValidity(valid, message = ''): boolean {
    if (!valid) {
      // use native system to block submit events.
      this.input.setCustomValidity(message);
    } else {
      this.input.setCustomValidity('');
    }

    return super.setValidity(valid, message);
  }

  inputHasWidget() {
    throw new TypeError('.inputHasWidget not implemented');
  }

  inputHasValue() {
    return this.state.hasValue;
  }

  // EVENT HANDLERS

  onFocus(e) {
    this.setActive();
    this.setState({ focus: true });

    if (e && this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    this.setState({ focus: false });

    if (e && this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onChange(e) {
    if (
      // revalidate if was invalid and cancel onChange if still invalid
      (this.isValid() || this.validate())
      && this.props.onChange
    ) {
      this.props.onChange({
        target: this.field,
        name: this.props.name,
        value: this.getValue(),
        originalEvent: e,
      });
    }
  }

  onInvalid(event) {
    event.preventDefault();

    this.setValidity(false, event.target.validationMessage, false);
  }

  bindInput(instance) {
    this.input = instance;
  }

  getValue() {
    throw new TypeError('.getValue is not implemented');
  }

  // RENDER METHODS

  getContainerProps() {
    const containerClassName = classnames(
      'progressive-form__container',
      this.props.className || '',
      this.getCommonFieldClassName(),
      {
        'progressive-form__container--has-focus': this.state.focus,
        'progressive-form__container--has-value': this.inputHasValue(),
        'progressive-form__container--has-widget': this.inputHasWidget(),
        'progressive-form__container--is-disabled': this.props.disabled,
      }
    );

    return {
      className: containerClassName,
    };
  }

  getWidgetProps() {

    const props = {
      ...this.props,

      // override special props
      id: this.getId(),
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onInvalid: this.onInvalid,
      className: 'progressive-form__widget',
      ref: this.bindInput,
      'aria-invalid': String(!this.isValid()),
    };

    for (const propName of widgetPropBlacklist) {
      delete props[propName];
    }

    return props;
  }

  getLabelProps() {

    return {
      className: 'progressive-form__label',
      htmlFor: this.getId(),
      children: this.props.label,
    };
  }

  getErrorMessageProps() {

    return {
      className: 'progressive-form__error',
      children: this.state.message,
    };
  }

  getAdditionalProps() {
    return {};
  }

  render() {

    const renderParameters = {
      ...this.getAdditionalProps(),
      containerProps: this.getContainerProps(),
      widgetProps: this.getWidgetProps(),
      labelProps: this.getLabelProps(),
      errorMessageProps: this.getErrorMessageProps(),
    };

    return this.props.render(renderParameters);
  }
}
