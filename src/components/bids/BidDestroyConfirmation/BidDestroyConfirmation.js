import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import Bid from '../../../models/Bid';
import DestroyConfirmation from '../../common/DestroyConfirmation';

class BidDestroyConfirmation extends React.Component {
  static propTypes = {
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    bid: PropTypes.instanceOf(Bid),
    deleting: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    bid: null,
  };

  render() {
    const {
      bid,
      cancel,
      confirm,
      deleting,
    } = this.props;
    return (
      <Modal isOpen={bid !== null} size="sm" toggle={cancel}>
        {
          bid ?
            <DestroyConfirmation
              cancel={cancel}
              confirm={confirm}
              deleting={deleting}
              message="Are you sure you want to delete this bid?"
            />
          :
            null
        }
      </Modal>
    );
  }
}

export default BidDestroyConfirmation;
