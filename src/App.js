import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { load, persist } from './actions/persistance';
import Layout from './components/Layout';
import Routes from './routes';

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => bindActionCreators({ load, persist }, dispatch);

class App extends React.Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    persist: PropTypes.func.isRequired,
    history: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.persistData = this.persistData.bind(this);
  }

  componentWillMount() {
    if (typeof Storage !== 'undefined') {
      console.info('WebStorage is available. Data can be persisted');
      this.props.load();
    } else {
      console.warn('WebStorage is not available in this browser. Data will be lost on close');
    }
    window.addEventListener('beforeunload', this.persistData);
  }

  componentWillUnmount() {
    this.persist();
    window.removeEventListener('beforeunload', this.persistData);
  }

  persistData() {
    console.warn('Persisting');
    if (typeof Storage !== 'undefined') {
      this.props.persist();
    }
  }

  render() {
    return (
      <ConnectedRouter history={this.props.history}>
        <Layout>
          <Routes />
        </Layout>
      </ConnectedRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
