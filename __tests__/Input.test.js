// @flow

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';
import { Input } from '../dist/bundle.es';
import { classNames } from './classes';

/*
 * Things that need testing:
 * - class names: they need to be stable for customization.
 * - aria
 * - native input validation
 * - min date / max date
 * - custom validation
 */

describe('<Input type="hidden">', () => {

  test('creates an hidden input', () => {
    const customInputComponent = ReactTestRenderer.create(
      <Input type="hidden" name="hidden-field" value="my-value" />
    );

    const input = customInputComponent.toJSON();

    expect(input).toMatchObject({
      type: 'input',
      props: {
        type: 'hidden',
        className: classNames.input,
        required: true,
        'aria-invalid': 'false',
      },
    });
  });
});

describe('<Input type="textarea">', () => {

  test('creates an hidden input', () => {
    const labelText = 'Textarea Input';
    const customInputComponent = ReactTestRenderer.create(
      <Input type="textarea" name="hidden-field" label={labelText} />
    );

    const input = customInputComponent.toJSON();

    expect(input).toMatchObject({
      props: {
        className: classNames.container,
        'aria-hidden': 'false',
      },

      children: [{
        type: 'textarea',
        props: {
          className: classNames.input,
          required: true,
          'aria-invalid': 'false',
        },
      }, {
        type: 'label',
        props: {
          className: classNames.label,
        },
        children: [labelText],
      }, {
        props: { className: classNames.message },
        children: [''], // no error message yet
      }],
    });
  });

  // No need to test if textarea receives the value correctly. React handles it the same way as input
});

describe('<Input type="text">', () => {

  test('creates a text input', () => {
    const labelText = 'Text Input';
    const customInputComponent = ReactTestRenderer.create(
      <Input type="text" label={labelText} />
    );

    const input = customInputComponent.toJSON();

    expect(input).toMatchObject({
      props: {
        className: classNames.container,
        'aria-hidden': 'false',
      },

      children: [{
        type: 'input',
        props: {
          type: 'text',
          className: classNames.input,
          required: true,
          'aria-invalid': 'false',
        },
      }, {
        type: 'label',
        props: {
          className: classNames.label,
        },
        children: [labelText],
      }, {
        props: { className: classNames.message },
        children: [''], // no error message yet
      }],
    });
  });

  test('has a unique, generated, id if none is provided', () => {
    const input1 = ReactTestUtils.findRenderedDOMComponentWithTag(
      ReactTestUtils.renderIntoDocument(<Input type="text" label="Text Input" />),
      'input',
    );

    const input2 = ReactTestUtils.findRenderedDOMComponentWithTag(
      ReactTestUtils.renderIntoDocument(<Input type="text" label="Text Input" />),
      'input',
    );

    expect(typeof input1.id).toBe('string');
    expect(input1.id.length).toBeGreaterThan(0);
    expect(input1.id).not.toBe(input2.id);
  });

  test('uses the provided id if provided', () => {
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
      ReactTestUtils.renderIntoDocument(<Input type="text" label="Text Input" id="id_1" />),
      'input',
    );

    expect(input.id).toBe('id_1');
  });

  test('uses the right id for the label', () => {
    const component = shallow(<Input type="text" label="Text Input" />);

    const input = component.find('input');
    const label = component.find('label');

    expect(label.prop('htmlFor')).toBe(input.prop('id'));
  });

  test('does not regen the id if the id prop does not change', () => {
    const component = shallow(<Input type="text" label="Text Input" />);

    const input = component.find('input');
    const oldId = input.prop('id');

    component.setProps({ label: 'new label' });
    component.update();

    const newId = input.prop('id');

    expect(newId).toBe(oldId);
  });

  test('updates the id on prop id change', () => {
    const component = shallow(<Input type="text" label="Text Input" />);

    const oldId = component.find('input').prop('id');
    const newId = 'my-custom-id';

    expect(oldId).not.toBe(newId);

    // replace generated id with provided prop.
    component.setProps({ id: newId });
    component.update();

    expect(component.find('input').prop('id')).toBe(newId);
    expect(component.find('input').prop('id')).not.toBe(oldId);
    expect(component.find('label').prop('htmlFor')).toBe(newId);

    // revert back to generated id if prop is removed.
    component.setProps({ id: void 0 });
    component.update();

    expect(component.find('input').prop('id')).toBe(oldId);
    expect(component.find('label').prop('htmlFor')).toBe(oldId);
  });

  test('value prop marks the component as having a value', () => {
    const component = shallow(<Input type="text" label="Text Input" value="Data!" />);

    expect(component.find('input').prop('value')).toEqual('Data!');
    expect(component.find(`.${classNames.container}`).prop('className').split(' '))
      .toContain(classNames.hasValue);
  });

  test('changing value prop updates hasValue status', () => {
    const component = shallow(<Input type="text" label="Text Input" value="Data!" />);

    expect(component.find('input').prop('value')).toEqual('Data!');
    expect(component.find(`.${classNames.container}`).prop('className').split(' '))
      .toContain(classNames.hasValue);

    component.setProps({ value: '' });
    component.update();

    expect(component.find('input').prop('value')).toEqual('');
    expect(component.find(`.${classNames.container}`).prop('className').split(' '))
      .not.toContain(classNames.hasValue);
  });

  test('defaultValue prop marks the component as having a value', () => {
    const component = shallow(<Input type="text" label="Text Input" defaultValue="Data!" />);

    expect(component.find(`.${classNames.container}`).prop('className').split(' '))
      .toContain(classNames.hasValue);

    expect(component.find('input').prop('defaultValue')).toEqual('Data!');
  });

  test('changing defaultValue prop should not update hasValue status', () => {
    const component = shallow(<Input type="text" label="Text Input" defaultValue="Data!" />);

    expect(component.find('input').prop('defaultValue')).toEqual('Data!');
    expect(component.find(`.${classNames.container}`).prop('className').split(' '))
      .toContain(classNames.hasValue);

    component.setProps({ defaultValue: '' });
    component.update();

    expect(component.find('input').prop('defaultValue')).toEqual('');
    expect(component.find(`.${classNames.container}`).prop('className').split(' '))
      .toContain(classNames.hasValue);
  });
});
