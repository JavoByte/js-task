import React from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  Nav,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
} from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
  }

  state = {
    isNavbarOpen: false,
  };

  toggleNavbar() {
    this.setState(prevState => ({
      isNavbarOpen: !prevState.isNavbarOpen,
    }));
  }

  closeNavbar() {
    this.setState({
      isNavbarOpen: false,
    });
  }

  render() {
    return (
      <div>
        <Navbar dark expand="md">
          <NavbarBrand href="/">
            <img src="https://via.placeholder.com/350x150.png?text=Cars+Task" alt="WebApp" height="30" width="auto" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isNavbarOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.closeNavbar} to="/merchants/" tag={RouterNavLink}>Merchants</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.closeNavbar} to="/database/" tag={RouterNavLink}>DB Utilities</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        { this.props.children }
      </div>
    );
  }
}

export default Layout;
