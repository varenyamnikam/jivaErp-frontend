import React from "react";
import Headerpart from "./headerpart";
import Footer from "./footer";
import Sidemenu from "./sidemenu";
class MainComponent extends React.Component {
  render() {
    return (
      <>
        <Headerpart />
        <Sidemenu />
        <>{this.props.page}</>
        <Footer />
      </>
    );
  }
}

export default MainComponent;
