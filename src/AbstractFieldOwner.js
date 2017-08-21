import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import AbstractField, { CONTEXT_KEYS } from './AbstractField';

export default class AbstractFieldOwner extends AbstractField {

  fields = new OrderedSet();
  static childContextTypes = {
    [CONTEXT_KEYS.owner]: PropTypes.object,
    [CONTEXT_KEYS.activeField]: PropTypes.object,
  };

  static propTypes = Object.assign({}, AbstractField.propTypes, {
    onStep: PropTypes.func,
    step: PropTypes.number,
  });

  constructor(props) {
    super(props);

    this.initStatePart({
      invalidFields: new Set(),
      activeField: props.step || 0,
    });
  }

  getChildContext() {
    return {
      [CONTEXT_KEYS.owner]: this,
      [CONTEXT_KEYS.activeField]: this.fields.get(this.state.activeField),
    };
  }

  componentWillReceiveProps(props, context) {
    super.componentWillReceiveProps(props, context);

    if (props.step !== this.props.step) {
      this.selectInput(props.step, true, false);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.mounted = true;
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.mounted = false;
  }

  previousInput() {
    this.selectInput(this.state.activeField - 1, true);
  }

  nextInput() {
    const newIndex = this.state.activeField + 1;

    // final input, validate!
    if (newIndex >= this.fields.size) {
      if (this.validateAll()) {
        this.props.onSubmit();
      }
    } else {
      this.selectInput(newIndex, false);
    }
  }

  validateStep(stepNum) {
    const input = this.fields.get(stepNum);
    if (!input) {
      return true;
    }

    if (!input.validate()) {
      return false;
    }

    return true;
  }

  selectInputComponent(component) {
    const pos = this.fields.indexOf(component);
    if (pos === -1) {
      return false;
    }

    return this.selectInput(pos);
  }

  selectInput(newIndex: number, force = true, notify = true) {
    if (newIndex === this.state.activeField) {
      return true;
    }

    const newChild = this.fields.get(newIndex);

    if (!newChild) {
      return false;
    }

    if (!force && !this.validateStep(this.state.activeField)) {
      return false;
    }

    this.setState({
      activeField: newIndex,
    }, () => {
      if (!newChild.focus) {
        console.warn('input does not have a .focus method');
        console.warn(newChild);
      } else {
        newChild.focus();
      }

      if (notify && this.props.onStep) {
        this.props.onStep(newIndex);
      }
    });

    return true;
  }

  bindField(newField, mounted) {
    this._bindField(newField, mounted);
    this.setState({ fields: this.fields });
  }

  _bindField(newField, mounted) {
    if (!mounted) {
      this.fields.delete(newField);
      return;
    }

    // The initial componentDidMount event is called post-order
    // so we can just add them as-is, they'll be sorted properly.
    // Once mounted, we need to compare the nodes positions to order them.
    if (!this.mounted || this.fields.size === 0) {
      this.fields.add(newField);
      return;
    }

    const newNode: Node = ReactDom.findDOMNode(newField); // eslint-disable-line

    let low = 0;
    let high = this.fields.size;

    for (let _i = 0; _i < this.fields.size; _i++) { // hard limit to avoid infinite loops
      const index = Math.floor((low + high) / 2);
      const field = this.fields.get(index);
      const fieldNode: Node = ReactDom.findDOMNode(field); // eslint-disable-line
      const pos = fieldNode.compareDocumentPosition(newNode);

      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
        // newNode after fieldNode
        low = index;
      } else if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
        // newNode before fieldNode
        high = index;
      }

      if (high - low <= 1) {
        this.fields.insertAfter(low, newField);
        return;
      }
    }

    console.warn('Could not determine where to insert new field.');
  }

  changeFieldValidity(field, valid) {
    const invalidFields = this.state.invalidFields;

    if (valid) {
      invalidFields.delete(field);
    } else {
      invalidFields.add(field);
    }

    this.setState({ invalidFields });
  }

  focus() {
    const field = this.fields.get(0);

    if (!field) {
      return;
    }

    if (!field.focus) {
      console.warn('input does not have a .focus method');
      console.warn(field);
    } else {
      field.focus();
    }
  }

  validate() {
    let valid = true;
    for (const field of this.fields) {
      if (!field.validate()) {
        valid = false;
      }
    }

    return valid;
  }

  isValid() {
    return super.isValid() && (this.state.invalidFields.size === 0);
  }
}

class OrderedSet {

  items = [];

  add(item) {
    if (item === void 0) {
      throw new TypeError('Cannot store undefined');
    }

    if (this.items.includes(item)) {
      return false;
    }

    this.items.push(item);
    return true;
  }

  delete(item) {
    const index = this.items.indexOf(item);
    if (index === -1) {
      return null;
    }

    return this.items.splice(index, 1)[0];
  }

  get(index) {
    return this.items[index];
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }

  get size() {
    return this.items.length;
  }

  indexOf(item) {
    return this.items.indexOf(item);
  }

  insertAfter(index, item) {
    this.items.splice(index + 1, 0, item);
  }
}

// reset the context on children so they don't pass it to their own children who do not belong to this owner.
AbstractField.childContextTypes = AbstractFieldOwner.childContextTypes;

// reset the AbstractField context to prevent it leaking to subfields.
const EMPTY_CONTEXT = {};
for (const fieldName of Object.keys(AbstractField.childContextTypes)) {
  EMPTY_CONTEXT[fieldName] = void 0;
}
Object.freeze(EMPTY_CONTEXT);

AbstractField.prototype.getChildContext = function getChildContext() {
  return EMPTY_CONTEXT;
};
