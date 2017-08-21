import { Children } from 'react';
import invariant from 'invariant';
import { noop } from './util';

const propTypes = {

};

export default propTypes;

if (process.env.NODE_ENV !== 'production') {

  /**
   * A function that will validate that all children of a component are of a specific type.
   *
   * Inspired by https://github.com/titon/toolkit/blob/3.0/src/prop-types/childrenOf.js
   *
   * @param {...*} types
   * @returns {Function}
   */
  propTypes.component = function component(...types) {
    const components = new WeakSet();
    const tags = new Set();

    for (const type of types) {
      if (typeof type === 'string') {
        // HTML tags
        tags.add(type);
      } else {
        // React components
        components.add(type);
      }
    }

    return function childrenPropType(props, propName, componentName) {

      try {
        Children.forEach(props[propName], child => {
          let passed = false;
          let type = child.type;

          if (typeof child !== 'object') {
            passed = false;
            type = typeof child;
          } else if (typeof type === 'string') {
            passed = tags.has(type);
          } else {
            passed = components.has(type);
            type = type.name;
          }

          invariant(passed, '`%s` does not allow children of type `%s`.', componentName, type);
        });
      } catch (e) {
        return e;
      }

      return null;
    };
  };
} else {
  propTypes.component = noop;
}
