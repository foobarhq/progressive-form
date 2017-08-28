import React from 'react';
import ReactDOM from 'react-dom';
import 'wicg-focus-ring';
import {
  Button,
  ButtonArea,
  Input,
  Form,
  CheckBox,
  Radio,
  Select,
  SelectGroup,
  SelectOption,
  ProgressiveFieldSet,
  ProgressiveForm,
  Legend,
} from '../dist/bundle.es';
import '../dist/bundle.css';
import H1 from './components/h1';
import H2 from './components/h2';
import P from './components/p';
import Li from './components/li';
import Code from './components/code';
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
        with <Code>progressive-form__</Code>.
      </P>
      <P>We also recommend using the WICG-focus-ring to remove the focus outline</P>

      <Form>
        <H2>Inputs</H2>
        <P>Component: <Code>Input</Code></P>
        <ul>
          <Li>
            Inputs have native support for float labels (pure CSS,
            can be disabled by overriding or replacing the css file).
          </Li>
          <Li>IDs are dynamically generated.</Li>
          <Li>Inputs are required by default, add the <Code>optional</Code> prop if they should not be.</Li>
          <Li>
            Does not support range inputs, we recommend
            using <a href="https://github.com/davidchin/react-input-range">This library instead</a>
          </Li>
          <Li>Use the <Code>Button</Code> component for inputs of type submit, reset, or button</Li>
          <Li>Use the <Code>Checkbox</Code> or <Code>Select</Code> component for inputs of type checkbox</Li>
          <Li>Use the <Code>Radio</Code> or <Code>Select</Code> component for inputs of type radio</Li>
          <Li>Use <Code>type="textarea"</Code> for textareas</Li>
          <Li>Use the <Code>validator</Code> and <Code>onValidityChange</Code> props to add custom validation.</Li>
          <Li>
            Error messages are added when the user tries to submit the form,
            and removed as soon as the input is valid again.
          </Li>
        </ul>

        <P>Class names:</P>
        <ul>
          <Li><Code>progressive-form__input-container</Code>: Placed on the container of the input element.</Li>
          <ul>
            <Li><Code>progressive-form__has-focus</Code>: Placed on the container when the input is focused.</Li>
            <Li><Code>progressive-form__is-filled</Code>: Placed on the container when the input has text in it.</Li>
            <Li>
              <Code>progressive-form__has-widget</Code>: Placed on the container when the input is special and
              has a native widget (file picker, color picker, date picker, etc).
            </Li>
            <Li>
              <Code>progressive-form__is-invalid</Code>: Placed on the container when the input validation fails.
            </Li>
            <Li>
              <Code>progressive-form__is-disabled</Code>: Placed on the container when the input is disabled.
            </Li>
            <Li>
              <Code>progressive-form__is-readonly</Code>: Placed on the container when the input is read-only.
            </Li>
          </ul>
          <Li><Code>progressive-form__input</Code>: Placed on the input element itself.</Li>
          <Li><Code>progressive-form__input-label</Code>: Placed on the label of the input element.</Li>
          <Li>
            <Code>progressive-form__input-message</Code>: Placed on the element that
            contains the input's error messages.
          </Li>
        </ul>

        <P>Some of these inputs are still WIP. Feel free to send a PR if you want to fix them.</P>
        <Input label="Text Input" type="text" placeholder="Input placeholder" />
        <Input label="Password Input" type="password" placeholder="Input placeholder" />
        <Input label="Email Input" type="email" placeholder="Input placeholder" />
        <Input label="Number Input" type="number" placeholder="Input placeholder" />
        <Input label="Textarea Input" type="textarea" placeholder="Input placeholder" />
        <Input label="Date Input" type="date" />
        <Input label="DateTime Input" type="datetime-local" />
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
        <P>Components: <Code>CheckBox</Code>, <Code>Radio</Code></P>
        <P>
          These components are highly stylizable radio buttons and checkboxes.
          They use real (invisible) inputs and are rendered using another dom element.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><Code>progressive-form__checkbox-label</Code>: Placed on the label/container of the checkbox/radio.</Li>
          <ul>
            <Li><Code>progressive-form__is-disabled</Code>: Placed on the label/container if the input is disabled.</Li>
          </ul>
          <Li><Code>progressive-form__checkbox</Code>: Placed on the checkbox/radio.</Li>
          <Li>
            <Code>progressive-form__fake-checkbox</Code>: Placed on the dom element used to render a custom checkbox.
          </Li>
        </ul>

        <CheckBox label="A checkbox" defaultChecked />
        <CheckBox label="Another checkbox" />

        <Radio label="A radio button" name="radio-1" defaultChecked />
        <Radio label="Another radio button" name="radio-1" />

        <H2>Select</H2>
        <P>Components: <Code>Select</Code>, <Code>SelectGroup</Code>, <Code>SelectOption</Code></P>
        <P>Select is an abstraction over CheckBox, Radio buttons and Select with the objective of unifying their API</P>
        <P>
          When possible, it is preferred to use this abstraction over <Code>CheckBox</Code> and <Code>Radio</Code>
          as this abstraction has a couple accessibility features like enhanced keyboard navigation.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><Code>progressive-form__select-container</Code>: Placed on the top-most container of the element.</Li>
          <ul>
            <Li>
              <Code>progressive-form__select--boxes</Code>: Placed on the top-most container of the element
              when the selected UI is boxes.
            </Li>
            <Li>
              <Code>progressive-form__select--dropdown</Code>: Placed on the top-most container of the element
              when the selected UI is dropdown.
            </Li>
          </ul>
          <Li>
            <Code>progressive-form__select-box-group</Code>: Placed on group of
            boxes (the top-most one and every SelectGroup).
          </Li>
          <Li><Code>progressive-form__select</Code>: Placed on the native select widget</Li>
          <Li><Code>progressive-form__select-message</Code>: Placed on the element that contains error messages</Li>
          <Li><Code>progressive-form__select-box-group-name</Code>: Placed on the title element of box groups</Li>
          <Li><Code>progressive-form__select-box</Code>: Placed on individual box wrappers.</Li>
          <Li><Code>progressive-form__is-disabled</Code>: Placed on wrappers of disabled boxes and groups.</Li>
          <Li><Code>progressive-form__is-checked</Code>: Placed on wrappers of checked boxes.</Li>
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
        <P>Components: <Code>Button</Code>, <Code>ButtonArea</Code></P>
        <P>
          <Code>Button</Code> is a simple button component that works well with the other components of this library.
          It does not have any special feature.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><Code>progressive-form__button-abstract</Code>: Placed on the button.</Li>
        </ul>

        <Button>Submit</Button>

        <P>
          <Code>ButtonArea</Code> is an accessibility-friendly way to add interactivity to non-interactive elements.
          Wrap any element that you want to make interactive with this component. It is a better way than adding
          an <Code>onclick</Code> handler on a div.
        </P>

        <P>Class names:</P>
        <ul>
          <Li><Code>progressive-form__button-abstract</Code>: Placed on the button.</Li>
          <Li><Code>progressive-form__button-area</Code>: Placed on the button.</Li>
        </ul>

        <ButtonArea>
          Button Area (button that does not have any style, makes children clickable in a a11y-friendly way)
        </ButtonArea>
      </Form>

      <H2>Progressive Form</H2>
      <P>Strangely, the core component of this library.</P>
      <P>
        It works like a form but its active fieldset and inputs receive an "active" class that
        makes it possible to progressively render a form by hiding or rendering differently fieldsets that
        are not relevant. There can only be one active field per form at a time.<br />

        Their error and active status also propagate upwards..
      </P>
      <P>
        In the following example, active fields and fieldsets have a green border, inactive ones have an orange border,
        and errored ones have a red border.
      </P>

      <ProgressiveForm submitBehavior={ProgressiveForm.SubmitBehavior.SUBMIT}>
        <ProgressiveFieldSet>
          <Legend>Field set 1</Legend>
          <Input label="An input!" />
          <Input label="Another input!" />
        </ProgressiveFieldSet>

        <Input label="An input outside a fieldset!" />
        <Input label="Another input!" />

        <ProgressiveFieldSet>
          <Legend>Field set 2</Legend>
          <Input label="A input that's lonely!" />
        </ProgressiveFieldSet>
        <Button>Button</Button>
      </ProgressiveForm>

      <P>
        This is the same form, but submitting a field will select the next one until you get to the final field
        which will submit the form. Whereas in the previous form, all inputs were validated the second you
        pressed submit.
      </P>
      <ProgressiveForm submitBehavior={ProgressiveForm.SubmitBehavior.NEXT_FIELD}>
        <ProgressiveFieldSet>
          <Legend>Field set 1</Legend>
          <Input label="An input!" />
          <Input label="Another input!" />
        </ProgressiveFieldSet>

        <Input label="An input outside a fieldset!" />
        <Select name="select-1" min={2} max={4} ui={Select.UI_DROPDOWN}>
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

        <ProgressiveFieldSet>
          <Legend>Field set 2</Legend>
          <Input label="A input that's lonely!" />
        </ProgressiveFieldSet>
        <Button>Button</Button>
      </ProgressiveForm>
    </div>
  );
}
