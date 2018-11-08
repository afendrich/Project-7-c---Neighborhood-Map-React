import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";

class ListDrawer extends Component {
  //initial state for list drawer
  state = {
    open: false,
    query: ""
  };

  //style for the drawer
  styles = {
    list: {
      width: "275px",
      padding: "0px 10px 0px"
    },

    fullList: {
      width: "auto"
    },
    listItem: {
      marginBottom: "5px"
    },
    listLink: {
      background: "transparent",
      border: "none",
      color: "black"
    },
    filterEntry: {
      border: "3px solid blue",
      padding: "3px",
      margin: "20px 0px 20px",
      width: "90%"
    }
  };

  //updates the filter query
  updateQuery = newQuery => {
    this.setState({ query: newQuery });
    this.props.filterLocations(newQuery);
  };

  render = () => {
    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.toggleDrawer}>
          <div style={this.styles.list}>
            <input
              style={this.styles.filterEntry}
              type="text"
              placeholder="Filter list"
              name="filter"
              onChange={e => this.updateQuery(e.target.value)}
              value={this.state.query}
            />
            <ul style={this.styles.noBullets}>
              {this.props.locations &&
                this.props.locations.map((location, index) => {
                  return (
                    <li style={this.styles.listItem} key={index}>
                      <button
                        style={this.styles.listLink}
                        key={index}
                        onClick={e => this.props.clickListItem(index)}
                      >
                        {location.name}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Drawer>
      </div>
    );
  };
}

export default ListDrawer;
