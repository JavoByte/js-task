import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import MerchantDestroyConfirmation from '../MerchantDestroyConfirmation';
import PaginationLinks from '../../common/PaginationLinks';
import LoaderTable from '../../common/LoaderTable';

class MerchantsIndex extends React.Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    merchants: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      deleting: PropTypes.bool.isRequired,
      pagination: PropTypes.shape({
        data: PropTypes.instanceOf(List).isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleMerchantToDelete = this.toggleMerchantToDelete.bind(this);
    this.load = this.load.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onDestroyMerchantConfirmed = this.onDestroyMerchantConfirmed.bind(this);
  }

  state = {
    page: 1,
    merchantToDelete: null,
  };

  componentWillMount() {
    const { search } = this.props.location;
    const filters = qs.parse(search);

    let { page } = filters;
    if (!page) {
      page = 1;
    } else if (!Number.isNaN(parseInt(page, 10))) {
      page = parseInt(page, 10);
    }
    this.setState({
      page,
    }, this.load);
  }

  componentWillReceiveProps(props) {
    if (this.props.merchants.deleting && !props.merchants.deleting) {
      this.props.load();
      this.setState({
        merchantToDelete: null,
      });
    }
  }

  onPageChange(page) {
    this.setState({ page }, this.load);
  }

  onDestroyMerchantConfirmed() {
    const { merchantToDelete } = this.state;
    this.props.destroy(merchantToDelete);
  }

  load() {
    const { page } = this.state;
    const filters = { page };
    this.props.load(filters);
    const search = qs.stringify(filters);
    this.props.replace({
      search,
    });
  }

  toggleMerchantToDelete(merchant, evt) {
    if (evt) {
      evt.stopPropagation();
    }
    this.setState(prevState => ({
      merchantToDelete: prevState.merchantToDelete ? null : merchant,
    }));
  }

  render() {
    return (
      <div className="container mt-sm-5 p-0">
        <div className="content p-md-4">

          <div className="p-4 p-md-0">
            <div className="float-right">
              <Link to="/merchants/create" className="btn btn-primary my-3">
                <i className="fas fa-user-plus" /> New
              </Link>
            </div>
            <h1>
              Merchants
            </h1>
          </div>

          <div className="mt-4">
            {
              this.props.merchants.loading ?
                <LoaderTable rows={10} />
              :
                <MerchantsTable
                  merchants={this.props.merchants.pagination}
                  changePage={this.onPageChange}
                  destroy={this.toggleMerchantToDelete}
                  push={this.props.push}
                />
            }
          </div>

          <MerchantDestroyConfirmation
            merchant={this.state.merchantToDelete}
            cancel={this.toggleMerchantToDelete}
            confirm={this.onDestroyMerchantConfirmed}
            deleting={this.props.merchants.deleting}
          />
        </div>
      </div>
    );
  }
}

function MerchantsTable({
  merchants,
  changePage,
  destroy,
  push,
}) {
  if (merchants.data.size === 0) {
    return (
      <div className="alert alert-info">
        There are no merchants to show
      </div>
    );
  }
  return (
    <div>
      <div className="pagination-table-container">
        <Table striped hover>
          <thead>
            <tr>
              <th>
                <span className="d-none d-md-table-cell">
                  Premium
                </span>
              </th>
              <th>Name</th>
              <th className="d-none d-md-table-cell">Email</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              merchants.data.map(merchant => (
                <tr
                  key={merchant.id}
                  role="button"
                  onClick={() => push(`/merchants/${merchant.id}`)}
                >
                  <td className="text-center">
                    {
                      merchant.has_premium ?
                        <i className="fas fa-fw fa-star text-warning" />
                      :
                        null
                    }
                  </td>
                  <td>{ merchant.first_name } { merchant.last_name }</td>
                  <td className="d-none d-md-table-cell">{ merchant.email }</td>
                  <td className="text-right">
                    {/*
                      <Link to={`/merchants/${merchant.id}`} className="btn btn-sm btn-primary">
                        <i className="fas fa-fw fa-info" />
                      </Link>
                    */}
                    {' '}
                    <Link onClick={evt => evt.stopPropagation()} to={`/merchants/${merchant.id}/edit`} className="btn btn-sm btn-outline-dark">
                      <i className="fas fa-fw fa-pencil-alt" /> {/* Edit */}
                    </Link>
                    {' '}
                    <Button color="danger" size="sm" onClick={evt => destroy(merchant, evt)}>
                      <i className="fas fa-fw fa-trash" /> {/* Delete */}
                    </Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>

      <PaginationLinks
        className="justify-content-md-center"
        currentPage={merchants.current_page}
        lastPage={merchants.last_page}
        changePage={changePage}
      />
    </div>
  );
}

MerchantsTable.propTypes = {
  merchants: PropTypes.shape({
    data: PropTypes.instanceOf(List).isRequired,
  }).isRequired,
  destroy: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
};

export default MerchantsIndex;
