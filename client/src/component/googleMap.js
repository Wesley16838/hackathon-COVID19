import { Map, GoogleApiWrapper, Marker,InfoWindow } from 'google-maps-react';
import React, {Component} from 'react';
// import  Current from './Marker';
const mapStyles = {
    height: 'calc(100vh - 150px)',
    margin: `0em`,
    top: `150px`
    };

class Googlemap extends Component {
    constructor(props) {
      super(props);
      this.state = {
          lat : parseInt(this.props.lat),
          lng : parseInt(this.props.lng),
          showingInfoWindow: false,  //Hides or the shows the infoWindow
          activeMarker: {},          //Shows the active marker upon click
          selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
      }
    }
    
    onMarkerClick = (props, marker, e) =>
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });

    onClose = props => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };
    render() {
  
      if(this.props.lat === '' && this.props.lng === ''){
        return (
          
            <Map
            google={this.props.google}
            zoom={13}
            style={mapStyles}
            initialCenter={{  lat: 39.833851,
                lng: -74.871826}}
            center={{  lat: 39.833851,
                lng: -74.871826}} >
             <Marker position={{ lat: 39.833851, lng: -74.871826}} />
          </Map>
          
          
      );
      }else{
        return (
          
            <Map
            google={this.props.google}
            zoom={15}
            style={mapStyles}
            initialCenter={{  lat: this.props.lat,
                lng: this.props.lng}}
                center={{  lat: this.props.lat,
                    lng: this.props.lng}}>
             <Marker
             position={{ lat: this.props.lat, lng: this.props.lng}} 
             icon={{
              url: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Right-Azure.png',
              // set marker width and height
              scaledSize: new window.google.maps.Size(50, 50)
             }
            }
             onClick={this.onMarkerClick}
             name={'Current Location'}
             />
             <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>
             {this.props.orders.map((order,index) => 
           
            <Marker 
              key={index} 
              position={{ lat: order.user.location.coordinates[1], lng: order.user.location.coordinates[0]}} 
              onClick={this.onMarkerClick}
              name={'Location'}
             />
             )}
          </Map>
          
          
      );
      }
      
    }
  }
  export default GoogleApiWrapper({
    apiKey: 'AIzaSyBmuVFyl548_WfKr2oqchbb4LgEiwHYjEU'
  })(Googlemap);