import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './styles.scss';

export default class ButtonAbstract extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor() {
    super();

    this.bindInstance = this.bindInstance.bind(this);
  }

  bindInstance(instance) {
    this.instance = instance;
  }

  focus() {
    return this.instance && this.instance.focus();
  }

  render() {
    const { children, className, ...otherProps } = this.props;

    return (
      <button {...otherProps} className={classnames(className, styles.buttonAbstract)} ref={this.bindInstance}>
        {children}
      </button>
    );
  }
}
