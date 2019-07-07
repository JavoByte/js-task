import React from 'react';
import PropTypes from 'prop-types';
import Switch from './ConnectedSwitch';
import Route from './ConnectedRoute';
import Container from '../components/database/DBContainer';
import Stats from '../components/database/DBStats';

function Merchants({ match }) {
  return (
    <Container>
      <Switch>
        <Route path={match.url} exact component={Stats} />
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
