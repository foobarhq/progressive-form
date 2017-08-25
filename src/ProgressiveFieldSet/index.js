import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import AbstractFieldOwner from '../AbstractFieldOwner';
import { CHARCODES } from '../util';
import styles from './styles.scss';

export default class ProgressiveFieldSet extends AbstractFieldOwner {

  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,

    onValidityChange: PropTypes.func,
    focusable: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onInputKeyUp = this.onInputKeyUp.bind(this);
  }

  onInputKeyUp(e) {
    const owner = this.fieldContext('owner');
    if (!owner || !owner.selectInputComponent) {
      return;
    }

    if (e.keyCode === CHARCODES.ENTER || e.keyCode === CHARCODES.SPACE) {
      owner.selectInputComponent(this);
    }
  }

  requestSubmit() {
    throw new TypeError('Fieldsets cannot be submitted. Is this ProgressiveFieldSet inside a ProgressiveForm?');
  }

  render() {
    const { focusable, ...fieldSetProps } = this.props;

    const className = classnames(
      styles.progressiveFieldset,
      fieldSetProps.className,
      this.getCommonFieldClassName(),
    );

    delete fieldSetProps.onValidityChange;

    if (focusable) {
      fieldSetProps.tabIndex = this.isActive() ? -1 : 0;
    }

    return (
      <fieldset // eslint-disable-line
        {...fieldSetProps}
        className={className}
        onKeyUp={this.onInputKeyUp}
      />
    );
  }
}
