import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

class ConnectedSwitch extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children, ...newProps } = this.props;
    return (
      <Switch>
        {
          React.Children.map(children, elem => (
            React.cloneElement(elem, newProps)
          ))
        }
      </Switch>
    );
  }
}

export default ConnectedSwitch;
