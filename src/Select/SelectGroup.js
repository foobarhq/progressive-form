import PropTypes from 'prop-types';
import CustomPropTypes from '../prop-types';
import SelectOption from './SelectOption';

/**
 * This component is merely a prop container and will be transformed into the appropriate component
 * when passed to Select.
 *
 * @returns {null}
 */
export default function SelectGroup() {
  return null;
}

SelectGroup.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  children: CustomPropTypes.component(SelectOption),
};
