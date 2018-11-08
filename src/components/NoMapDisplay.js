import React, { Component } from "react";

class NoMapDisplay extends Component {
  state = {
    show: false,
    timeout: null
  };

  //wait 1 second to see if google maps loads
  componentDidMount = () => {
    let timeout = window.setTimeout(this.showMessage, 1000);
    this.setState({ timeout });
  };

  //cleanup if timeout is still running
  componentWillUnmount = () => {
    window.clearTimeout(this.state.timeout);
  };

  //show error message
  showMessage = () => {
    this.setState({ show: true });
  };

  //render the error message
  render = () => {
    return (
      <div>
        {this.state.show ? (
          <div>
            <h1>ERROR LOADING THE MAP</h1>
          </div>
        ) : (
          <div>
            <h1>LOADING PLEASE WAIT</h1>
          </div>
        )}{" "}
      </div>
    );
  };
}
export default NoMapDisplay;
