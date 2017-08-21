import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './styles.scss';

export default function Legend(props) {

  const className = classnames(styles.legend, props.className);

  // this should be a <legend> element but that element has so many bugs it was replaced with <p>
  // TODO find a way to automatically insert `aria-describedby` on the fieldset as a replacement.

  return (
    <p className={className}>
      {props.children}
    </p>
  );
}

Legend.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  className: PropTypes.string,
};
