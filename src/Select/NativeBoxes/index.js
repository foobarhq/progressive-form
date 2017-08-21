import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import AbstractField from '../../AbstractField';
import SelectOption from '../SelectOption';
import SelectGroup from '../SelectGroup';
import RadioCheckBox from '../../CheckBox/Common';
import { noop } from '../../util';
import styles from './styles.scss';

const IMMUTABLE_SET = new Set();
IMMUTABLE_SET.add = noop;
IMMUTABLE_SET.delete = noop;
IMMUTABLE_SET.clear = noop;
Object.freeze(IMMUTABLE_SET);

/* eslint-disable react/prop-types */

export default class NativeBoxes extends AbstractField {

  constructor(props) {
    super(props);

    this.renderChild = this.renderChild.bind(this);

    this.onNewProps(props);

    this.initStatePart({
      selected: this.initSelectedSet(props.children),
    });
  }

  componentWillReceiveProps(props, context) {
    super.componentWillReceiveProps(props, context);
    this.onNewProps(props);

    const selected = this.initSelectedSet(props.children, this.state.selected);
    this.setState({ selected });
  }

  onNewProps(props) {
    this.inputType = (props.max > 1 || props.max == null) ? 'checkbox' : 'radio';
  }

  initSelectedSet(children, selected: Set = new Set()): Set {
    const wereSelectedList = this.wereSelectedList || IMMUTABLE_SET;
    const newSelectedList = new Set();

    this._initSelectedList(children, selected, wereSelectedList, newSelectedList);

    this.wereSelectedList = newSelectedList;

    return selected;
  }

  _initSelectedList(children, selected: Set, wereSelectedList: Set, newSelectedList: Set) {
    React.Children.forEach(children, child => {
      if (child.type === SelectGroup) {
        this._initSelectedList(child.props.children, selected, wereSelectedList, newSelectedList);
      } else if (child.type === SelectOption) {
        const isSelected = child.props.selected;
        const wasSelected = wereSelectedList.has(child.props.value);
        const key = child.props.value;

        if (isSelected && !wasSelected) {
          selected.add(key);
          newSelectedList.add(key);
        } else if (!isSelected && wasSelected) {
          selected.delete(key);
        }
      }
    });
  }

  onChange(e, option) {
    const selectedList = this.state.selected;
    const checked = e.target.checked;
    const value = option.props.value;

    if (this.inputType === 'radio') {
      selectedList.clear();
    }

    if (checked) {
      selectedList.add(value);
    } else {
      selectedList.delete(value);
    }

    this.setState({ selected: selectedList });

    if (this.props.onChange) {
      this.props.onChange({
        value: Array.from(selectedList),
        name: this.props.name,
      });
    }
  }

  renderGroup(group, isParentDisabled) {

    const props = group.props;
    isParentDisabled = isParentDisabled || props.disabled;

    const options = React.Children.map(group.props.children, child => this.renderOption(child, isParentDisabled));

    return (
      <li
        className={classnames(props.className, {
          [styles.isDisabled]: isParentDisabled,
        })}
      >
        <span className={styles.selectBoxGroupName}>{props.label}</span>
        <NativeBoxList inputType={this.inputType}>
          {options}
        </NativeBoxList>
      </li>
    );
  }

  renderOption(option, isParentDisabled) {
    const props = option.props;
    const value = props.value;
    const disabled = props.disabled || isParentDisabled || (
      this.inputType === 'checkbox'
      && this.state.selected.size >= this.props.max
      && !this.state.selected.has(value)
    );

    // const id = this.getFieldId(option);

    const inputProps = Object.assign({}, props);
    delete inputProps.children;
    delete inputProps.className;

    const isSelected = this.state.selected.has(value);

    return (
      <li
        className={classnames(props.className, styles.selectBox, {
          [styles.isDisabled]: disabled,
          [styles.isChecked]: isSelected,
        })}
      >
        <RadioCheckBox
          {...inputProps}
          optional={!(this.inputType === 'radio' && this.props.min > 0)}
          type={this.inputType}
          role={this.inputType}
          value={value}
          disabled={disabled}
          checked={isSelected}
          aria-checked={isSelected}
          name={this.props.name}
          form={this.props.form}
          onChange={e => this.onChange(e, option)}
          label={props.children}
        />
      </li>
    );
  }

  renderChild(child) {

    switch (child.type) {
      case SelectGroup:
        return this.renderGroup(child, this.props.disabled || false);

      case SelectOption:
        return this.renderOption(child, this.props.disabled || false);

      default:
        return null;
    }
  }

  focus() {
    const instance = ReactDOM.findDOMNode(this); // eslint-disable-line
    if (!instance) {
      return;
    }

    const input = instance.querySelector('input');
    if (input) {
      input.focus();
    }
  }

  render() {
    const children = React.Children.map(this.props.children, this.renderChild);

    return (
      <div className={classnames(this.props.className, styles.select, styles['select--boxes'])}>
        <NativeBoxList inputType={this.inputType}>
          {children}
        </NativeBoxList>
        {this.renderErrorMessage()}
      </div>
    );
  }

  renderErrorMessage() {
    if (!this.state.message) {
      return null;
    }

    return <p>{this.state.message}</p>;
  }

  validate() {
    const selected: Set = this.state.selected;

    if (selected.size > this.props.max) {
      return this.setValidity(false, `Select at most ${this.props.max} item(s).`);
    }

    if (selected.size < this.props.min) {
      return this.setValidity(false, `Select at least ${this.props.min} item(s).`);
    }

    return this.setValidity(true);
  }
}

function NativeBoxList(props) {

  const additionalProps = {};
  if (props.inputType === 'radio') {
    additionalProps.role = 'radiogroup';
  }

  return (
    <ul
      className={classnames(styles.selectBoxGroup, props.className)}
      {...additionalProps}
    >
      {props.children}
    </ul>
  );
}

NativeBoxList.propTypes = {
  inputType: PropTypes.string.isRequired,
  className: PropTypes.string,
};

NativeBoxes.defaultProps = {
  optional: false,
};
