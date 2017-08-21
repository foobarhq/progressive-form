import React from 'react';
import ReactDOM from 'react-dom';
import 'wicg-focus-ring';
import { Button, ButtonArea, Input, Form, CheckBox, Radio, Select, SelectGroup, SelectOption } from '../src';
import H1 from './components/h1';
import H2 from './components/h2';
import P from './components/p';
import Li from './components/li';
import style from './style.scss';

ReactDOM.render(
  <Page />,
  document.getElementById('app'),
);

function Page() {

  return (
    <div className={style.page}>
      <H1>Progressive Forms</H1>
      <P>A collection of extensible form components.</P>
      <P>
        These components are for the most part unstyled, as their purpose is to implement <em>reusable logic</em> -
        instead of <em>reusable styles</em> - such as advanced field validation, ajax forms,
        progressive form (inputs displaying one after the other).
      </P>
      <P>
        This implementation tries to respect the Accessibility Guidelines as much as possible. Please open an issue
        if you find any error in that regard (or any for that matter).
      </P>
      <P>
        We recommend you override the style using another CSS file. All class names are prefixed
        with <code>progressive-form__</code>.
      </P>
      <P>We also recommend using the WICG-focus-ring to remove the focus outline</P>

      <Form>
        <H2>Inputs</H2>
        <P>Component: <code>Input</code></P>
        <ul>
          <Li>
            Inputs have native support for float labels (pure CSS,
            can be disabled by overriding or replacing the css file).
          </Li>
          <Li>IDs are dynamically generated.</Li>
          <Li>Inputs are required by default, add the <code>optional</code> prop if they should not be.</Li>
          <Li>
            Does not support range inputs, we recommend
            using <a href="https://github.com/davidchin/react-input-range">This library instead</a>
          </Li>
          <Li>Use the <code>Button</code> component for inputs of type submit, reset, or button</Li>
          <Li>Use the <code>Checkbox</code> or <code>Select</code> component for inputs of type checkbox</Li>
          <Li>Use the <code>Radio</code> or <code>Select</code> component for inputs of type radio</Li>
          <Li>Use <code>type="textarea"</code> for textareas</Li>
          <Li>Use the <code>validator</code> and <code>onValidityChange</code> props to add custom validation.</Li>
        </ul>

        <P>Class names:</P>
        <ul>
          <Li><code>progressive-form__input-container</code>: Placed on the container of the input element.</Li>
          <ul>
            <Li><code>progressive-form__has-focus</code>: Placed on the container when the input is focused.</Li>
            <Li><code>progressive-form__is-filled</code>: Placed on the container when the input has text in it.</Li>
            <Li>
              <code>progressive-form__is-invalid</code>: Placed on the container when the input validation fails.
            </Li>
            <Li>
              <code>progressive-form__is-disabled</code>: Placed on the container when the input is disabled.
            </Li>
            <Li>
              <code>progressive-form__is-readonly</code>: Placed on the container when the input is read-only.
            </Li>
          </ul>
          <Li><code>progressive-form__input</code>: Placed on the input element itself.</Li>
          <Li><code>progressive-form__input-label</code>: Placed on the label of the input element.</Li>
          <Li>
            <code>progressive-form__input-message</code>: Placed on the element that
            contains the input's error messages.
          </Li>
        </ul>

        <P>Some of these inputs are still WIP. Feel free to send a PR if you want to fix them.</P>
        <Input label="Text Input" type="text" placeholder="Input placeholder" />
        <Input label="Password Input" type="password" placeholder="Input placeholder" />
        <Input label="Email Input" type="email" placeholder="Input placeholder" />
        <Input label="Number Input" type="number" placeholder="Input placeholder" />
        <Input label="Textarea Input" type="textarea" placeholder="Input placeholder" />
        <Input label="Date Input" type="date" placeholder="Input placeholder" />
        <Input label="DateTime Input" type="datetime-local" placeholder="Input placeholder" />
        <Input label="Color Input" type="color" placeholder="Input placeholder" />
        <Input label="File Input" type="file" placeholder="Input placeholder" />
        <Input label="Month Input" type="month" placeholder="Input placeholder" />
        <Input label="Year Input" type="year" placeholder="Input placeholder" />
        <Input label="Search Input" type="search" placeholder="Input placeholder" />
        <Input label="Telephone Input" type="tel" placeholder="Input placeholder" />
        <Input label="Time Input" type="time" placeholder="Input placeholder" />
        <Input label="URL Input" type="url" placeholder="Input placeholder" />
        <Input label="Week Input" type="week" placeholder="Input placeholder" />
        <Input label="Range Input" type="range" />

        <Input label="Disabled Input" disabled type="text" placeholder="Input placeholder" />
        <Input label="Readonly Input" readOnly type="text" placeholder="Input placeholder" />

        <H2>Checkboxes & Radio Buttons</H2>
        <P>Components: <code>CheckBox</code>, <code>Radio</code></P>
        <P>
          These components are highly stylizable radio buttons and checkboxes.
          They use real (invisible) inputs and are rendered using another dom element.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><code>progressive-form__checkbox-label</code>: Placed on the label/container of the checkbox/radio.</Li>
          <ul>
            <Li><code>progressive-form__is-disabled</code>: Placed on the label/container if the input is disabled.</Li>
          </ul>
          <Li><code>progressive-form__checkbox</code>: Placed on the checkbox/radio.</Li>
          <Li>
            <code>progressive-form__fake-checkbox</code>: Placed on the dom element used to render a custom checkbox.
          </Li>
        </ul>

        <CheckBox label="A checkbox" defaultChecked />
        <CheckBox label="Another checkbox" />

        <Radio label="A radio button" name="radio-1" defaultChecked />
        <Radio label="Another radio button" name="radio-1" />

        <H2>Select</H2>
        <P>Components: <code>Select</code>, <code>SelectGroup</code>, <code>SelectOption</code></P>
        <P>Select is an abstraction over CheckBox, Radio buttons and Select with the objective of unifying their API</P>
        <P>
          When possible, it is preferred to use this abstraction over <code>CheckBox</code> and <code>Radio</code>
          as this abstraction has a couple accessibility features like enhanced keyboard navigation.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><code>progressive-form__select</code>: Placed on the top-most container of the element.</Li>
          <ul>
            <Li>
              <code>progressive-form__select--boxes</code>: Placed on the top-most container of the element
              when the selected UI is boxes.
            </Li>
            <Li>
              <code>progressive-form__select--dropdown</code>: Placed on the top-most container of the element
              when the selected UI is dropdown.
            </Li>
          </ul>
          <Li>
            <code>progressive-form__select-box-group</code>: Placed on group of
            boxes (the top-most one and every SelectGroup).
          </Li>
          <Li><code>progressive-form__select-box-group-name</code>: Placed on the title element of box groups</Li>
          <Li><code>progressive-form__select-box</code>: Placed on individual box wrappers.</Li>
          <Li><code>progressive-form__is-disabled</code>: Placed on wrappers of disabled boxes and groups.</Li>
          <Li><code>progressive-form__is-checked</code>: Placed on wrappers of checked boxes.</Li>
        </ul>

        <P>Select without selection limit, using dropdown UI</P>
        <Select name="select-1">
          <SelectOption value="0">Option 0</SelectOption>
          <SelectGroup label="Group 1">
            <SelectOption value="1">Option 1</SelectOption>
            <SelectOption value="2">Option 2</SelectOption>
            <SelectOption value="3">Option 3</SelectOption>
          </SelectGroup>
          <SelectGroup label="Group 2">
            <SelectOption value="4">Option 1</SelectOption>
            <SelectOption value="5">Option 2</SelectOption>
            <SelectOption value="6">Option 3</SelectOption>
          </SelectGroup>
        </Select>

        <P>Select with selection limit, using dropdown UI</P>
        <Select name="select-1" max={1}>
          <SelectOption value="0">Option 0</SelectOption>
          <SelectGroup label="Group 1">
            <SelectOption value="1">Option 1</SelectOption>
            <SelectOption value="2">Option 2</SelectOption>
            <SelectOption value="3">Option 3</SelectOption>
          </SelectGroup>
          <SelectGroup label="Group 2">
            <SelectOption value="4">Option 1</SelectOption>
            <SelectOption value="5">Option 2</SelectOption>
            <SelectOption value="6">Option 3</SelectOption>
          </SelectGroup>
        </Select>

        <P>Select without selection limit, using box UI with a disabled group.</P>
        <Select name="select-1" ui={Select.UI_BOXES}>
          <SelectOption value="0">Option 0</SelectOption>
          <SelectGroup disabled label="Group 1">
            <SelectOption value="1">Option 1</SelectOption>
            <SelectOption value="2">Option 2</SelectOption>
            <SelectOption value="3">Option 3</SelectOption>
          </SelectGroup>
          <SelectGroup label="Group 2">
            <SelectOption value="4">Option 1</SelectOption>
            <SelectOption value="5">Option 2</SelectOption>
            <SelectOption value="6">Option 3</SelectOption>
          </SelectGroup>
        </Select>

        <P>Select with selection limit, using box UI</P>
        <Select name="select-1" max={1} ui={Select.UI_BOXES}>
          <SelectOption value="0">Option 0</SelectOption>
          <SelectGroup label="Group 1">
            <SelectOption value="1">Option 1</SelectOption>
            <SelectOption value="2">Option 2</SelectOption>
            <SelectOption value="3">Option 3</SelectOption>
          </SelectGroup>
          <SelectGroup label="Group 2">
            <SelectOption value="4">Option 1</SelectOption>
            <SelectOption value="5">Option 2</SelectOption>
            <SelectOption value="6">Option 3</SelectOption>
          </SelectGroup>
        </Select>

        <H2>Buttons</H2>
        <P>Components: <code>Button</code>, <code>ButtonArea</code></P>
        <P>
          <code>Button</code> is a simple button component that works well with the other components of this library.
          It does not have any special feature.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><code>progressive-form__button-abstract</code>: Placed on the button.</Li>
        </ul>

        <Button>Submit</Button>

        <P>
          <code>ButtonArea</code> is an accessibility-friendly way to add interactivity to non-interactive elements.
          Wrap any element that you want to make interactive with this component. It is a better way than adding
          an <code>onclick</code> handler on a div.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><code>progressive-form__button-abstract</code>: Placed on the button.</Li>
          <Li><code>progressive-form__button-area</code>: Placed on the button.</Li>
        </ul>

        <ButtonArea>
          Button Area (button that does not have any style, makes children clickable in a a11y-friendly way)
        </ButtonArea>
      </Form>
    </div>
  );
}
