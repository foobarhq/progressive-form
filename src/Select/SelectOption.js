import PropTypes from 'prop-types';

/**
 * This component is merely a prop container and will be transformed into the appropriate component
 * when passed to Select.
 *
 * @returns {null}
 */
export default function SelectOption() {
  return null;
}

SelectOption.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  className: PropTypes.string,
};
