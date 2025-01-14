import React, { useState } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const location = useLocation(); // useLocation hook to access current route

  // Toggle collapse for mobile view
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  // Close collapse on link click
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // Helper function to check if route is active
  const activeRoute = (routeName) =>
    location.pathname.indexOf(routeName) > -1 ? "active" : "";

  // Create links dynamically based on the routes array
  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key} className="mb-2">
        <NavLink
          to={prop.layout + prop.path}
          tag={NavLinkRRD}
          onClick={closeCollapse}
          className={`d-flex align-items-center ${activeRoute(
            prop.layout + prop.path
          )}`}
        >
          <i className={`mr-2 ${prop.icon}`} />
          {prop.name}
        </NavLink>
      </NavItem>
    ));
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;

  if (logo && logo.innerLink) {
    navbarBrandProps = { to: logo.innerLink, tag: Link };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = { href: logo.outterLink, target: "_blank" };
  }

  return (
    <Navbar
      className={`navbar-vertical fixed-left navbar-light bg-${bgColor}`}
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler for mobile view */}
        <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand logo */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
          </NavbarBrand>
        ) : null}

        {/* Collapse content for mobile */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Search form (visible in mobile) */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                placeholder="Search"
                type="search"
                className="form-control-rounded"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fas fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>

          {/* Navigation links */}
          <Nav navbar>
            {createLinks(routes)}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [],
  bgColor: "white",
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
  bgColor: PropTypes.string,
};

export default Sidebar;
