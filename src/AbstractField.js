// @flow

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './styles.scss';

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
    if (this.hasOwner()) {
      this.getOwner().bindField(this, true);
    }
  }

  componentWillUnmount() {
    if (this.hasOwner()) {
      this.getOwner().bindField(this, false);
    }
  }

  componentWillReceiveProps() {}

  setValidity(valid: boolean, message): boolean {
    const oldValid = this.state.valid;

    this.setState({ valid, message }, () => {
      const owner = this.fieldContext('owner');
      if (owner) {
        owner.changeFieldValidity(this, valid);
      }

      if (oldValid !== valid && this.props.onValidityChange) {
        this.props.onValidityChange(this, valid);
      }
    });

    return valid;
  }

  hasOwner() {
    return this.getOwner() != null;
  }

  getOwner() {
    return this.fieldContext('owner');
  }

  isValid() {
    return this.state.valid;
  }

  isActive() {
    if (!this.hasOwner()) {
      return true;
    }

    return this.getOwner().isActive() && this.fieldContext('activeField') === this;
  }

  setActive() {
    if (this.hasOwner()) {
      this.getOwner().setActiveField(this);
    }
  }

  getCommonFieldClassName() {
    const isValid = this.isValid();
    const isActive = this.isActive();

    return classnames({
      [this.fieldContext('activeClass') || '']: isActive,
      [this.fieldContext('inactiveClass') || '']: !isActive,
      [this.fieldContext('validClass') || styles.isInvalid]: isValid,
      [this.fieldContext('invalidClass') || styles.isInvalid]: !isValid,
    }) || '';
  }

  /* eslint-enable react/prop-types */

  focus() {
    throw new TypeError('.focus is not implemented');
  }

  blur() {
    throw new TypeError('.blur is not implemented');
  }

  validate() {
    throw new TypeError('.validate is not implemented');
  }
}
