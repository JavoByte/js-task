import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { seed, clear } from '../../../actions/persistance';

const mapStateToProps = state => ({
  database: state.persistance,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ seed, clear }, dispatch);

class DBContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div id="db-container">
        {
          React.Children.map(this.props.children, elem => (
            React.cloneElement(elem, this.props)
          ))
        }
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DBContainer);
