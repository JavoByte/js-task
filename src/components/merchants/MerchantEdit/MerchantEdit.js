import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Row, Col } from 'reactstrap';
import MerchantForm from '../MerchantForm';

class MerchantEdit extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    load: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    merchants: PropTypes.shape({
      pagination: PropTypes.shape({
        data: PropTypes.instanceOf(List),
      }).isRequired,
      errors: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
      saving: PropTypes.bool.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.searchMerchant = this.searchMerchant.bind(this);
  }

  state = {
    merchant: null,
    merchantNotFound: null,
  };

  componentWillMount() {
    const merchant = this.searchMerchant();
    if (!merchant) {
      this.props.load({
        id: this.props.match.params.id,
      });
    } else {
      this.setState({
        merchant,
      });
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.merchants.loading && !props.merchants.loading) {
      setTimeout(() => {
        const merchant = this.searchMerchant();
        if (merchant) {
          this.setState({
            merchant,
          });
        } else {
          this.setState({
            merchantNotFound: true,
          });
        }
      });
    }
    if (this.props.merchants.saving
      && !props.merchants.saving
      && !props.merchants.errors) {
      this.props.goBack();
    }
  }

  searchMerchant() {
    const { id } = this.props.match.params;
    const merchants = this.props.merchants.pagination.data;
    return merchants.find(item => item.id === id);
  }

  render() {
    if (!this.state.merchant) {
      if (this.props.merchants.loading) {
        return (
          <div className="alert alert-info">
            Loading...
          </div>
        );
      } else if (this.state.merchantNotFound) {
        return (
          <div className="alert alert-danger">
            Not found
          </div>
        );
      }
      // Never rendered but prefer no missing return
      return null;
    }
    return (
      <div className="container p-0 mt-md-4">
        <Row noGutters>
          <Col md={{ offset: 2, size: 8 }}>
            <div className="content p-2 p-md-4">
              <h1 className="mb-4">
                Edit merchant
              </h1>
              <MerchantForm
                merchant={this.state.merchant}
                apiErrors={this.props.merchants.errors}
                saving={this.props.merchants.saving}
                onSubmit={this.props.save}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MerchantEdit;
