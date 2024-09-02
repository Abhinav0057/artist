import React, { useState } from "react";

import { Link } from "react-router-dom";
// import user1 from "../../public/logo192.png";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

const Header = (props) => {
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");

  const handleLogoutHandler = () => {
    localStorage.setItem("token", "");
    const domain = window.location.origin;
    const newUrl = domain + "/login";
    window.location.replace(newUrl);
  };

  return (
    <React.Fragment>
      <header id="page-topbar" class="border border-secondary">
        <div class="navbar-header w-100">
          <div class="d-flex justify-content-between align-items-center w-100 p-3">
            <div class="navbar-brand-box">
              <Link to="/" class="navbar-brand  fw-bold">
                Artist Management
              </Link>
            </div>
            <Dropdown
              isOpen={menu}
              toggle={() => setMenu(!menu)}
              className="d-inline-block"
            >
              <DropdownToggle
                className=" d-flex align-items-center"
                id="page-header-user-dropdown"
                tag="button"
              >
                <img
                  class="rounded-circle"
                  src="http://localhost:3000/logo192.png"
                  alt="Header Avatar"
                  width="35"
                  height="35"
                />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <Link
                  to="/login"
                  className="dropdown-item text-danger d-flex align-items-center"
                >
                  <i class="mdi mdi-power me-2"></i>
                  <span>Logout</span>
                </Link>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
