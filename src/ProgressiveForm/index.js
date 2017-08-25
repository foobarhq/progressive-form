import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Form from '../Form';
import AbstractFieldOwner from '../AbstractFieldOwner';
import { CONTEXT_KEYS } from '../AbstractField';

const CONTEXT_PROPS = {
  activeClass: PropTypes.string,
  inactiveClass: PropTypes.string,
  invalidClass: PropTypes.string,
  validClass: PropTypes.string,
};

const CONTEXT_PROP_NAMES = Object.keys(CONTEXT_PROPS);
Object.freeze(CONTEXT_PROPS);

const SubmitBehavior = {
  SUBMIT: 0,
  NEXT_FIELD: 1,
};

Object.freeze(SubmitBehavior);

export default class ProgressiveForm extends AbstractFieldOwner {

  static SubmitBehavior = SubmitBehavior;

  static propTypes = Object.assign(
    {
      submitBehavior: PropTypes.oneOf(Object.values(SubmitBehavior)),
      onSubmit: PropTypes.func.isRequired,
    },
    AbstractFieldOwner.propTypes,
    Form.propTypes,
    CONTEXT_PROPS,
  );

  static childContextTypes = Object.assign(
    AbstractFieldOwner.childContextTypes,
    {
      [CONTEXT_KEYS.activeClass]: PropTypes.string,
      [CONTEXT_KEYS.inactiveClass]: PropTypes.string,

      [CONTEXT_KEYS.invalidClass]: PropTypes.string,
      [CONTEXT_KEYS.validClass]: PropTypes.string,
    }
  );

  static defaultProps = {
    activeClass: 'progressive-form__is-active',
    inactiveClass: 'progressive-form__is-inactive',
    invalidClass: 'progressive-form__is-invalid',
    validClass: 'progressive-form__is-valid',
    submitBehavior: SubmitBehavior.NEXT_FIELD,
  };

  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.selectNextInputIfValid = this.selectNextInputIfValid.bind(this);
    this.requestSubmit = this.requestSubmit.bind(this);

    this.onNewProps(props);
  }

  componentWillReceiveProps(props, context) {
    super.componentWillReceiveProps(props, context);

    this.onNewProps(props);
  }

  onNewProps(props) {
    const nativeFormProps = Object.assign({}, props);

    delete nativeFormProps.onStep;
    delete nativeFormProps.step;
    delete nativeFormProps.activeClass;
    delete nativeFormProps.inactiveClass;
    delete nativeFormProps.validClass;
    delete nativeFormProps.invalidClass;
    delete nativeFormProps.submitBehavior;

    if (props.submitBehavior === SubmitBehavior.NEXT_FIELD) {
      nativeFormProps.noValidate = true;
    }

    this.nativeFormProps = nativeFormProps;
  }

  getChildContext() {
    const context = super.getChildContext();

    for (const propName of CONTEXT_PROP_NAMES) {
      context[CONTEXT_KEYS[propName]] = this.props[propName];
    }

    return context;
  }

  getCommonFieldClassName() {
    const isValid = this.isValid();

    return classnames({
      [this.props.validClass]: isValid,
      [this.props.invalidClass]: !isValid,
    });
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.props.onStep) {
      this.props.onStep(this.state.activeField);
    }
  }

  // ======

  requestSubmit() {
    return this.props.onSubmit();
  }

  render() {
    const className = classnames(
      this.props.className,
      this.getCommonFieldClassName(),
    );

    return (
      <Form
        {...this.nativeFormProps}
        validate={this.validate}
        onSubmit={
          this.props.submitBehavior === SubmitBehavior.NEXT_FIELD
            ? this.selectNextInputIfValid
            : this.requestSubmit
        }
        className={className}
      />
    );
  }
}
