import React from 'react';
import PropTypes from 'prop-types';
import {
  ModalFooter,
  ModalBody,
  Button,
} from 'reactstrap';

export default class DestroyConfirmation extends React.Component {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    deleting: PropTypes.bool,
    children: PropTypes.node,
    message: PropTypes.string,
    confirmMessage: PropTypes.string,
    cancelMessage: PropTypes.string,
  };

  static defaultProps = {
    deleting: false,
    confirmMessage: 'Yes, delete',
    cancelMessage: 'Cancel',
    message: 'Are you sure?',
    children: null,
  };

  render() {
    const {
      confirm,
      cancel,
      deleting,
      message,
      confirmMessage,
      cancelMessage,
      children,
    } = this.props;
    return (
      <React.Fragment>
        <ModalBody>
          { children || message }
        </ModalBody>
        {
          !deleting ?
            <ModalFooter>
              <Button outline color="dark" size="sm" onClick={cancel}>
                { cancelMessage }
              </Button>
              <Button color="danger" size="sm" onClick={confirm}>
                { confirmMessage }
              </Button>
            </ModalFooter>
          :
            <ModalFooter>
              <Button color="danger" size="sm" disabled>
                <i className="fas fa-spinner fa-spin" /> Deleting...
              </Button>
            </ModalFooter>
        }
      </React.Fragment>
    );
  }
}
