import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
} from 'reactstrap';
import MerchantForm from '../MerchantForm';

class MerchantCreate extends React.Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    merchants: PropTypes.shape({
      saving: PropTypes.bool.isRequired,
      errors: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }).isRequired,
  };

  componentWillReceiveProps(props) {
    if (this.props.merchants.saving
      && !props.merchants.saving
      && !props.merchants.errors) {
      this.props.push({
        pathname: '/merchants',
        search: '?page=last',
      });
    }
  }

  render() {
    return (
      <div className="container p-0 mt-md-4">
        <Row>
          <Col md={{ offset: 2, size: 8 }}>
            <div className="content p-2 p-md-4">
              <h1 className="mb-4">
                New merchant
              </h1>
              <MerchantForm
                saving={this.props.merchants.saving}
                apiErrors={this.props.merchants.errors}
                onSubmit={this.props.save}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MerchantCreate;
