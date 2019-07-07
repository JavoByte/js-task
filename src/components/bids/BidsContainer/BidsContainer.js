import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as bidsActions from '../../../actions/bids';
import Index from '../BidsIndex';

const mapStateToProps = state => ({
  bids: state.bids,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(bidsActions, dispatch);


class BidsContainer extends React.Component {
  static propTypes = {
    merchantID: PropTypes.string,
    load: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
  };

  static defaultProps = {
    merchantID: null,
  };

  render() {
    return (
      <Index {...this.props} />
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(BidsContainer);
