import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

const CONTEXT_NAMESPACE = 'components/Form/AbstractField:context:';

export const CONTEXT_KEYS = {
  owner: `${CONTEXT_NAMESPACE}owner`,
  activeField: `${CONTEXT_NAMESPACE}activeField`,
  activeClass: `${CONTEXT_NAMESPACE}activeClass`,
  inactiveClass: `${CONTEXT_NAMESPACE}inactiveClass`,
  invalidClass: `${CONTEXT_NAMESPACE}invalidClass`,
  validClass: `${CONTEXT_NAMESPACE}validClass`,
};

/**
 * Form Component are React Components which expose two methods:
 * - validate() which validates all contained form components or itself.
 * - focus() which focuses the first contained form component or itself.
 *
 * To mark a React Component as a Form Component, add a static property with this as the key and true as the value.
 */
export default class AbstractField extends React.Component {

  static propTypes = {
    onValidityChange: PropTypes.func,
  };

  static contextTypes = {
    [CONTEXT_KEYS.owner]: PropTypes.object,
    [CONTEXT_KEYS.activeField]: PropTypes.object,

    [CONTEXT_KEYS.activeClass]: PropTypes.string,
    [CONTEXT_KEYS.inactiveClass]: PropTypes.string,

    [CONTEXT_KEYS.invalidClass]: PropTypes.string,
    [CONTEXT_KEYS.validClass]: PropTypes.string,
  };

  fieldContext(fieldName) {
    if (!CONTEXT_KEYS[fieldName]) {
      throw new TypeError(`Trying to get field context "${fieldName}" but it does not exist`);
    }

    return this.context && this.context[CONTEXT_KEYS[fieldName]];
  }

  constructor() {
    super();

    this.initStatePart({ valid: true });
  }

  initStatePart(statePart) {
    if (!this.state) {
      this.state = {};
    }

    Object.assign(this.state, statePart);
  }

  /* eslint-disable react/prop-types */
  componentDidMount() {
    const owner = this.fieldContext('owner');

    if (owner) {
      owner.bindField(this, true);
    }
  }

  componentWillUnmount() {
    const owner = this.fieldContext('owner');

    if (owner) {
      owner.bindField(this, false);
    }
  }

  componentWillReceiveProps() {}

  setValidity(valid, message) {
    this.setState({
      valid, message,
    }, () => {
      const owner = this.fieldContext('owner');
      if (owner) {
        owner.changeFieldValidity(this, valid);
      }

      if (this.props.onValidityChange) {
        this.props.onValidityChange(this, valid);
      }
    });

    return valid;
  }

  isValid() {
    return this.state.valid;
  }

  isActive() {
    return this.fieldContext('activeField') === this;
  }

  getCommonFieldClassName() {
    const isValid = this.isValid();
    const isActive = this.isActive();

    return classnames({
      [this.fieldContext('activeClass') || '']: isActive,
      [this.fieldContext('inactiveClass') || '']: !isActive,
      [this.fieldContext('validClass') || '']: isValid,
      [this.fieldContext('invalidClass') || '']: !isValid,
    }) || '';
  }

  /* eslint-enable react/prop-types */

  focus() {
    throw new TypeError('.focus is not implemented');
  }

  validate() {
    throw new TypeError('.validate is not implemented');
  }
}
