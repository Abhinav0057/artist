import React, { useState } from "react";

import { Link } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { useGetUserProfile } from "../services/fetchers/auth/auth";

const Header = (props) => {
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");

  const userProfile = useGetUserProfile();

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
            <div class="navbar-brand-box d-flex justify-content-between">
              <Link to="/" class="navbar-brand px-3 fw-bold">
                Artist Management
              </Link>

              {userProfile?.isSuccess && (
                <div className="d-flex  ">
                  {userProfile.data?.role_type === "super_admin" && (
                    <div class="navbar-brand-box px-2">
                      <Link to="/users" class="navbar-brand">
                        Users
                      </Link>
                    </div>
                  )}
                  {userProfile.data?.role_type != "artist" && (
                    <div class="navbar-brand-box px-2">
                      <Link to="/artists" class="navbar-brand">
                        Artists
                      </Link>
                    </div>
                  )}
                  {userProfile?.isSuccess && (
                    <div class="navbar-brand-box px-2">
                      {userProfile.data?.role_type === "artist" ? (
                        <Link
                          to={`/my/songs/${userProfile.data.id}`}
                          className="navbar-brand"
                        >
                          My songs
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Dropdown
              isOpen={menu}
              toggle={() => setMenu(!menu)}
              className="d-inline-block"
            >
              <DropdownToggle              
              >
                <img
                  class="rounded-circle"
                  src="http://localhost:3000/logo192.png"
                  alt="Header Avatar"
                  width="25"
                  height="25"
                />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <Link
                  onClick={handleLogoutHandler}
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
