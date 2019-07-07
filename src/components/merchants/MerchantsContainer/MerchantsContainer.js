import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import * as merchantsActions from '../../../actions/merchants';

const mapStateToProps = state => ({
  merchants: state.merchants,
  bids: state.bids,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...merchantsActions,
  push,
  replace,
  goBack,
}, dispatch);

class MerchantsContainer extends React.Component {
  static propTypes = {
    match: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { match, ...propsToInherit } = this.props;
    return (
      <div id="merchants-container">
        {
          React.Children.map(this.props.children, elem => (
            React.cloneElement(elem, { ...propsToInherit })
          ))
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MerchantsContainer));
