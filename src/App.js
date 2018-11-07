import React, { Component } from "react";
import "./App.css";
import mapLocations from "./mapData/mapLocations.json";
import MapDisplay from "./components/MapDisplay";

class App extends Component {
  state = {
    lat: 40.285782,
    lon: -76.650993,
    zoom: 12,
    all: mapLocations
  };

  render = () => {
    return (
      <div className="App">
        <div>
          <h1>Check these spots out near Hershey, PA</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.all}
        />
      </div>
    );
  };
}

export default App;
