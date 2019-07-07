import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

function Home() {
  return (
    <div className="container mt-md-5 p-0">
      <Row>
        <Col md={{ offset: 2, size: 8 }}>
          <div className="content p-5">
            <h1 className="mb-4">
              Welcome!
            </h1>
            <p className="lead">
              This is a sample project created by <a href="mailto:javier.lavida@gmail.com">Javier Enríquez</a> to
              show coding skills with <a href="https://reactjs.org/">React</a> and <a href="https://redux.js.org/">Redux</a>
            </p>
            <hr className="my-4" />

            <p className="text-justify">
              This project will mockup its database using local storage.
              After first start, it will seed some merchants (no bids).
            </p>
            <p className="text-justify">
              Backend requests has been also mocked and will simulate a
              random delay between 0 and 4 seconds to better observe
              loading messages.
            </p>
            <p className="text-justify">
              You can go directly to the <Link to="/merchants">merchants</Link> page or checkout
              {' '}
              <Link to="/database">mocked DB stats and utilities</Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
