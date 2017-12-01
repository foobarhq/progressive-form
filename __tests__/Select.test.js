// @flow

import React from 'react';
import classnames from 'classnames';
import ReactTestRenderer from 'react-test-renderer';
import { Select, SelectOption, SelectGroup } from '../dist/bundle.es';
import { classNames } from './classes';

/*
 * Things that need testing:
 * - class names: they need to be stable for customization.
 * - aria
 * - native input validation
 * - custom validation
 */

describe('<Select>', () => {

  test('creates a basic Select field', () => {
    const labelText = 'Text Input';
    const customInputComponent = ReactTestRenderer.create(
      <Select label={labelText}>
        <SelectOption value="opt1">Option 1</SelectOption>
      </Select>
    );

    const input = customInputComponent.toJSON();

    expect(input).toMatchObject({
      props: {
        className: classnames(classNames.container, classNames.hasWidget),
      },

      children: [{
        type: 'select',
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
});
