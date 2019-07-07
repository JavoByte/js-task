import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Row,
  Col,
  CardDeck,
  Card,
  CardBody,
  CardFooter,
  Modal,
  Button,
} from 'reactstrap';
import './DBStats.css';
import SeedDBModal from '../SeedDBModal';
import DestroyConfirmation from '../../common/DestroyConfirmation';

export default class DBStats extends React.Component {
  static propTypes = {
    database: PropTypes.shape({
      merchants: PropTypes.objectOf(PropTypes.object).isRequired,
      bids: PropTypes.objectOf(PropTypes.object).isRequired,
      config: PropTypes.shape({
        seeding: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    seed: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleSeedBidsModal = this.toggleSeedBidsModal.bind(this);
    this.toggleSeedMerchantsModal = this.toggleSeedMerchantsModal.bind(this);
    this.toggleClearDBModal = this.toggleClearDBModal.bind(this);
    this.clearDB = this.clearDB.bind(this);
  }

  state = {
    showSeedBidsModal: false,
    showSeedMerchantsModal: false,
    showClearDBModal: false,
  };

  componentWillReceiveProps(props) {
    if (props.database.config.seeding && !this.props.database.config.seeding) {
      this.setState({
        showSeedBidsModal: false,
        showSeedMerchantsModal: false,
      });
    }
  }

  toggleSeedBidsModal() {
    this.setState(prevState => ({
      showSeedBidsModal: !prevState.showSeedBidsModal,
    }));
  }

  toggleSeedMerchantsModal() {
    this.setState(prevState => ({
      showSeedMerchantsModal: !prevState.showSeedMerchantsModal,
    }));
  }

  toggleClearDBModal() {
    this.setState(prevState => ({
      showClearDBModal: !prevState.showClearDBModal,
    }));
  }

  clearDB() {
    this.props.clear();
    this.setState({
      showClearDBModal: false,
    });
  }

  render() {
    const { database, seed } = this.props;
    return (
      <div className="container mt-4">
        <Row>
          <Col md={{ offset: 2, size: 8 }}>

            <CardDeck>
              <Card className="stats-card">
                <CardBody>
                  <h2 className="text-center display-2">
                    { numeral(Object.keys(database.merchants).length).format('0,0') }
                  </h2>
                  <div className="seed-btn-container">
                    <Button size="sm" color="link" onClick={this.toggleSeedMerchantsModal}>
                      Seed
                    </Button>
                  </div>
                </CardBody>
                <CardFooter className="text-white bg-primary">
                  <div className="text-center">
                    Registered Merchants
                  </div>
                </CardFooter>
              </Card>

              <Card className="stats-card">
                <CardBody>
                  <h2 className="text-center display-2">
                    { numeral(Object.keys(database.bids).length).format('0,0') }
                  </h2>
                  <div className="seed-btn-container">
                    <Button size="sm" color="link" onClick={this.toggleSeedBidsModal}>
                      Seed
                    </Button>
                  </div>
                </CardBody>
                <CardFooter className="text-white bg-primary">
                  <div className="text-center">
                    Registered Bids
                  </div>
                </CardFooter>
              </Card>
            </CardDeck>
            <div className="content my-4 p-4">

              <h3>
                NOTE:
              </h3>
              <p>
                Seeding merchants won&apos;t always seed the wished merchants
                because email must be unique and current implementation
                does&apos;nt guarantee a
                random non existing email will be generated.
              </p>
            </div>

            <div className="text-right mb-4">
              <Button color="danger" size="lg" onClick={this.toggleClearDBModal}>
                Clear database
              </Button>
            </div>
          </Col>
        </Row>

        <SeedDBModal
          title="Seed merchants"
          message="How many merchants do you want to seed?"
          show={this.state.showSeedMerchantsModal}
          cancel={this.toggleSeedMerchantsModal}
          confirm={count => seed('merchants', count)}
        />

        <SeedDBModal
          title="Seed bids"
          message="How many bids do you want to seed?"
          show={this.state.showSeedBidsModal}
          cancel={this.toggleSeedBidsModal}
          confirm={count => seed('bids', count)}
        />

        <Modal isOpen={this.state.showClearDBModal} toggle={this.toggleClearDBModal}>
          <DestroyConfirmation
            message="Are you sure you want to clear the database?"
            cancel={this.toggleClearDBModal}
            confirm={this.clearDB}
          />

        </Modal>

      </div>
    );
  }
}
