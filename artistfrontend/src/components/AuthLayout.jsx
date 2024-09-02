import React, { Component } from "react";
import { Container } from "reactstrap";

// Layout Related Components
import Header from "./Header";
import Footer from "./Footer";

class AuthLayout extends Component {
  constructor(props) {
    super(props);
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidMount() {
    if (this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }

    // Scroll Top to 0
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">Loading...</div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Header />
          <div className="main-content">
            <div className="page-content">
              <Container fluid>{this.props.children}</Container>
            </div>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default AuthLayout;
