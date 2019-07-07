import React from 'react';
import PropTypes from 'prop-types';
import Switch from './ConnectedSwitch';
import Route from './ConnectedRoute';
import Container from '../components/merchants/MerchantsContainer';
import Index from '../components/merchants/MerchantsIndex';
import Detail from '../components/merchants/MerchantDetail';
import Create from '../components/merchants/MerchantCreate';
import Edit from '../components/merchants/MerchantEdit';

function Merchants({ match }) {
  return (
    <Container>
      <Switch>
        <Route path={match.url} exact component={Index} />
        <Route path={`${match.url}/create`} exact component={Create} />
        <Route path={`${match.url}/:id`} exact component={Detail} />
        <Route path={`${match.url}/:id/edit`} component={Edit} />
      </Switch>
    </Container>
  );
}

Merchants.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Merchants;
