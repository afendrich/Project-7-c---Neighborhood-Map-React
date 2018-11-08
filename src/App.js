import React, { Component } from "react";
import "./App.css";
import locations from "./data/locations.json";
import MapDisplay from "./components/MapDisplay";
import ListDrawer from "./components/ListDrawer";

class App extends Component {
  //initial state for the map
  state = {
    lat: 40.285782,
    lon: -76.650993,
    zoom: 13,
    all: locations,
    filtered: null,
    open: false
  };

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "aqua",
      padding: 10
    },
    hide: {
      display: "none"
    },
    header: {
      marginTop: "0px"
    }
  };

  //after component mounts set states
  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterLocations(this.state.all, "")
    });
  };

  //this toggles the drawer value for open/close
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  };

  //update query for search filter
  updateQuery = query => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, query)
    });
  };

  //filter the locations based on matching query
  filterLocations = (locations, query) => {
    return locations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  //filters based on clicking list item
  clickListItem = index => {
    this.setState({ selectedIndex: index, open: !this.state.open });
  };

  render = () => {
    return (
      <div className="App">
        <div>
          <button
            class="drawerButton"
            onClick={this.toggleDrawer}
            style={this.styles.menuButton}
          >
            <i className="fa fa-bars" />
          </button>
          <h1>Places to check out near Hershey, PA</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.filtered}
          selectedIndex={this.state.selectedIndex}
        />
        <ListDrawer
          locations={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          filterLocations={this.updateQuery}
          clickListItem={this.clickListItem}
        />
      </div>
    );
  };
}

export default App;
