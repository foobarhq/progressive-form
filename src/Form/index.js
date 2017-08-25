import PropTypes from 'prop-types';
import React from 'react';

export default class Form extends React.Component {

  static propTypes = {
    validate: PropTypes.func,
    onSubmit: PropTypes.func,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.submitHandler = this.submitHandler.bind(this);

    this.onNewProps(props);
  }

  componentWillReceiveProps(props) {
    this.onNewProps(props);
  }

  submitHandler(e) {
    e.preventDefault();

    if (!this.props.noValidate && this.props.validate && !this.props.validate()) {
      return false;
    }

    if (this.props.onSubmit && !this.props.onSubmit(e)) {
      return false;
    }

    return true;
  }

  onNewProps(props) {
    this.nativeFormProps = Object.assign({}, props);

    delete this.nativeFormProps.onSubmit;
    delete this.nativeFormProps.validate;
    delete this.nativeFormProps.className;
  }

  render() {
    return (
      <form
        className={this.props.className}
        onSubmit={this.submitHandler}
        {...this.nativeFormProps}
      />
    );
  }
}

