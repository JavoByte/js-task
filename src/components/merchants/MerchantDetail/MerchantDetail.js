import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import moment from 'moment-timezone';
import { Row, Col } from 'reactstrap';
import BidsContainer from '../../bids/BidsContainer';

class MerchantDetail extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    load: PropTypes.func.isRequired,
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
    const { merchant } = this.state;
    const tz = moment.tz.guess();
    return (
      <div className="container mt-md-3 p-0">

        <Row noGutters>
          <Col md={{ size: 8, offset: 2 }}>
            <div className="content p-2 p-md-4">
              <Row className="align-items-center mb-5">
                <Col xs={12} md={4} lg={3} className="text-center mb-4 mb-md-0 px-5 px-sm-3 px-md-0">
                  <img
                    alt={merchant.fullName}
                    src={merchant.avatar_url || '//placehold.it/300x300?text=Avatar'}
                    className="img-fluid rounded border"
                  />
                </Col>
                <Col className="px-3">
                  <h1>
                    { merchant.fullName }
                    {' '}
                    {
                      merchant.has_premium ?
                        <i className="text-warning fas fa-star" />
                      :
                        null
                    }
                  </h1>
                  <div>
                    <i className="fas fa-fw fa-envelope" />
                    {' '}
                    <a href={`mailto:${merchant.email}`}>
                      { merchant.email }
                    </a>
                  </div>
                  <address className="mt-1 mb-1">
                    <i className="fas fa-fw fa-phone" />
                    {' '}
                    { merchant.phone }
                  </address>
                  <small>
                    <p className="text-muted m-0">
                      Registered at: { merchant.created_at.tz(tz).format('DD.MM.YY HH:mm') }
                    </p>
                    <p className="text-muted m-0">
                      Last updated: { merchant.updated_at.tz(tz).format('DD.MM.YY HH:mm') }
                    </p>
                  </small>
                </Col>
              </Row>
              <BidsContainer merchantID={merchant.id} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MerchantDetail;
