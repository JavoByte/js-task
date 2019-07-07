import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment-timezone';
import { List } from 'immutable';
import { Table, Button } from 'reactstrap';
import Bid from '../../../models/Bid';
import PaginationLinks from '../../common/PaginationLinks';
import LoadingTable from '../../common/LoaderTable';
import BidCreate from '../BidCreate';
import BidDestroyConfirmation from '../BidDestroyConfirmation';

class BidsIndex extends React.Component {
  static propTypes = {
    merchantID: PropTypes.string,
    load: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    bids: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      saving: PropTypes.bool.isRequired,
      deleting: PropTypes.bool.isRequired,
      pagination: PropTypes.shape({
        data: PropTypes.instanceOf(List).isRequired,
      }).isRequired,
      errors: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }).isRequired,
  };

  static defaultProps = {
    merchantID: null,
  };

  constructor(props) {
    super(props);
    this.load = this.load.bind(this);
    this.toggleCreateForm = this.toggleCreateForm.bind(this);
    this.toggleBidToDelete = this.toggleBidToDelete.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onDestroyBidConfirmed = this.onDestroyBidConfirmed.bind(this);
  }

  state = {
    page: 1,
    showCreateForm: false,
    bidToDelete: null,
  };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps(props) {
    if (this.props.bids.saving
      && !props.bids.saving
      && !props.bids.errors) {
      this.setState({
        page: 1,
        showCreateForm: false,
      }, this.load);
    }
    if (this.props.bids.deleting
      && !props.bids.deleting) {
      this.setState({
        bidToDelete: null,
      }, this.load);
    }
  }

  onPageChange(page) {
    this.setState({
      page,
    }, this.load);
  }

  onDestroyBidConfirmed() {
    const { bidToDelete: bid } = this.state;
    this.props.destroy(bid);
  }

  load() {
    this.props.load({
      page: this.state.page,
      merchant_id: this.props.merchantID,
    });
  }

  toggleCreateForm() {
    this.setState(prevState => ({
      showCreateForm: !prevState.showCreateForm,
    }));
  }

  toggleBidToDelete(bid = null) {
    this.setState(prevState => ({
      bidToDelete: prevState.bidToDelete ? null : bid,
    }));
  }

  render() {
    const { loading, saving, deleting } = this.props.bids;
    return (
      <div>

        <div className="text-right mb-4">
          <Button onClick={this.toggleCreateForm} color="primary">
            <i className="fas fa-plus" /> New bid
          </Button>
        </div>
        {
          loading ?
            <LoadingTable rows={10} />
          :
            <BidsTable
              pagination={this.props.bids.pagination}
              changePage={this.onPageChange}
              destroy={this.toggleBidToDelete}
            />
        }

        <BidCreate
          show={this.state.showCreateForm}
          cancel={this.toggleCreateForm}
          save={data => this.props.save(new Bid({ ...data, merchant_id: this.props.merchantID }))}
          errors={this.props.bids.errors}
          saving={saving}
        />
        <BidDestroyConfirmation
          bid={this.state.bidToDelete}
          cancel={this.toggleBidToDelete}
          confirm={this.onDestroyBidConfirmed}
          deleting={deleting}
        />
      </div>
    );
  }
}

function BidsTable({
  pagination,
  changePage,
  destroy,
}) {
  if (pagination.data.size === 0) {
    return (
      <div className="alert alert-info">
        There are no bids to show
      </div>
    );
  }
  const tz = moment.tz.guess();
  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th className="text-center">Car Title</th>
            <th className="text-center">Amount</th>
            <th className="text-center d-none d-md-table-cell">Date</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
            pagination.data.map(bid => (
              <tr key={bid.id}>
                <td>
                  { bid.car_title }
                </td>
                <td className="text-right text-nowrap">
                  € { numeral(bid.amount).format('0,0.00') }
                </td>
                <td className="d-none d-md-table-cell text-center">
                  { bid.created_at.tz(tz).format('DD.MM.YY HH:mm')}
                </td>
                <td className="text-right">
                  <Button size="sm" color="danger" outline onClick={() => destroy(bid)}>
                    <i className="fas fa-trash fa-fw" />
                  </Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      <PaginationLinks
        className="justify-content-center"
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        changePage={changePage}
      />
    </div>
  );
}

BidsTable.propTypes = {
  pagination: PropTypes.shape({
    data: PropTypes.instanceOf(List).isRequired,
    current_page: PropTypes.number.isRequired,
    last_page: PropTypes.number.isRequired,
  }).isRequired,
  changePage: PropTypes.func.isRequired,
  destroy: PropTypes.func.isRequired,
};

export default BidsIndex;
