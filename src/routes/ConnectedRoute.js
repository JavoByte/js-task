import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

class ConnectedRoute extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    component: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { children, component, ...newProps } = this.props;
    return (
      <Route
        {...newProps}
        render={props => (
          <this.props.component {...props} {...this.props} />
          )
        }
      />
    );
  }
}

export default ConnectedRoute;
