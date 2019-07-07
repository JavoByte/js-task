import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import Merchant from '../../../models/Merchant';
import DestroyConfirmation from '../../common/DestroyConfirmation';

class MerchantDestroyConfirmation extends React.Component {
  static propTypes = {
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    merchant: PropTypes.instanceOf(Merchant),
    deleting: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    merchant: null,
  };

  render() {
    const {
      merchant,
      cancel,
      confirm,
      deleting,
    } = this.props;
    return (
      <Modal isOpen={merchant !== null} size="sm" toggle={cancel}>
        {
          merchant ?
            <DestroyConfirmation
              cancel={cancel}
              confirm={confirm}
              deleting={deleting}
            >
              <p>
                Are you sure you want to delete merchant { merchant.fullName }?
              </p>
              <p>
                This action cannot be undone
              </p>
            </DestroyConfirmation>
          :
            null
        }
      </Modal>
    );
  }
}

export default MerchantDestroyConfirmation;
