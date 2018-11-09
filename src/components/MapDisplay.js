import React, { Component } from "react";
import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import NoMapDisplay from "./NoMapDisplay";

//google maps api key
const MAP_KEY = "AIzaSyB6BYF1KfAVrkPBNZ8dXqE-UwehSTtq0iU";
//keys for accessing foursquare data
const FS_CLIENT = "L101NHSYMNHUQMEZHA32NRVREUSC1TKKEPUZ2UVG1RIJSO5R";
const FS_SECRET = "4XETDSH2ROP5UBUV2EYRDBZOKUI5FOQBLJE2YM43PY0ONBCF";
const FS_VERSION = "20181107";

class MapDisplay extends Component {
  //states for map/marker/infowindow
  state = {
    map: null,
    markers: [],
    markerProps: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false
  };

  componentDidMount = () => {};

  componentWillReceiveProps = props => {
    this.setState({ firstDrop: false });

    //if there is a change in quantity of locations, markers updated
    if (this.state.markers.length !== props.locations.length) {
      this.closeInfoWindow();
      this.updateMarkers(props.locations);
      this.setState({ activeMarker: null });

      return;
    }

    //close the infowindow if the active marker is not same as selected
    if (
      !props.selectedIndex ||
      (this.state.activeMarker &&
        this.state.markers[props.selectedIndex] !== this.state.activeMarker)
    ) {
      this.closeInfoWindow();
    }

    //check if there is a selected index
    if (
      props.selectedIndex === null ||
      typeof props.selectedIndex === "undefined"
    ) {
      return;
    }

    //marker is clicked
    this.onMarkerClick(
      this.state.markerProps[props.selectedIndex],
      this.state.markers[props.selectedIndex]
    );
  };

  //set the state for map and prepare location markers
  mapReady = (props, map) => {
    this.setState({ map });
    this.updateMarkers(this.props.locations);
  };

  //diables active markers animation
  closeInfoWindow = () => {
    this.state.activeMarker && this.state.activeMarker.setAnimation(null);
    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      activeMarkerProps: null
    });
  };

  //look for foursqurae data based on names in data/location.json (populated from google maps)
  getBusinessInfo = (props, data) => {
    return data.response.venues.filter(
      item => item.name.includes(props.name) || props.name.includes(item.name)
    );
  };

  //on marker click close infowindow
  onMarkerClick = (props, marker, e) => {
    this.closeInfoWindow();

    //fetch foursquare data
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=100&ll=${
      props.position.lat
    },${props.position.lng}&llAcc=100`;
    let headers = new Headers();
    let request = new Request(url, {
      method: "GET",
      headers
    });

    //create props for active marker
    let activeMarkerProps;
    fetch(request)
      .then(response => response.json())
      .then(result => {
        //get the buisness reference from foursquare
        let restaurant = this.getBusinessInfo(props, result);
        activeMarkerProps = {
          ...props,
          foursquare: restaurant[0]
        };

        //get foursquare images, or set state for information received
        if (activeMarkerProps.foursquare) {
          let url = `https://api.foursquare.com/v2/venues/${
            restaurant[0].id
          }/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
          fetch(url)
            .then(response => response.json())
            .then(result => {
              activeMarkerProps = {
                ...activeMarkerProps,
                images: result.response.photos
              };
              if (this.state.activeMarker)
                this.state.activeMarker.setAnimation(null);
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
              this.setState({
                showingInfoWindow: true,
                activeMarker: marker,
                activeMarkerProps
              });
            });
        } else {
          marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
          this.setState({
            showingInfoWindow: true,
            activeMarker: marker,
            activeMarkerProps
          });
        }
      });
  };

  updateMarkers = locations => {
    //if all locations filtered return
    if (!locations) return;

    //remove existing markers from map
    this.state.markers.forEach(marker => marker.setMap(null));

    //create empty array for markerProps
    let markerProps = [];
    //create object of markers with data for infowindow
    let markers = locations.map((location, index) => {
      let mProps = {
        key: index,
        index,
        name: location.name,
        position: location.pos,
        url: location.website
      };
      markerProps.push(mProps);

      let animation = this.state.fisrtDrop
        ? this.props.google.maps.Animation.DROP
        : null;
      let marker = new this.props.google.maps.Marker({
        position: location.pos,
        map: this.state.map,
        animation
      });
      marker.addListener("click", () => {
        this.onMarkerClick(mProps, marker, null);
      });
      return marker;
    });

    this.setState({ markers, markerProps });
  };

  render = () => {
    const style = {
      //width: "100%",
      //height: "100%"
    };
    const center = {
      lat: this.props.lat,
      lng: this.props.lon
    };
    let amProps = this.state.activeMarkerProps;

    return (
      <Map
        role="application"
        aria-label="map"
        onReady={this.mapReady}
        google={this.props.google}
        zoom={this.props.zoom}
        style={style}
        initialCenter={center}
        onClick={this.closeInfoWindow}
      >
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.closeInfoWindow}
        >
          <div>
            <h3>{amProps && amProps.name}</h3>
            {amProps && amProps.url ? (
              <a href={amProps.url}>{amProps.url}</a>
            ) : (
              ""
            )}
            {amProps && amProps.images ? (
              <div>
                <img
                  alt={amProps.name + " foursquare picture"}
                  src={
                    amProps.images.items[0].prefix +
                    "100x100" +
                    amProps.images.items[0].suffix
                  }
                />
                <p>Image provided by Foursquare</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </InfoWindow>
      </Map>
    );
  };
}

export default GoogleApiWrapper({
  apiKey: MAP_KEY,
  LoadingContainer: NoMapDisplay
})(MapDisplay);
