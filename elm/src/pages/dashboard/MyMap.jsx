
import {Map, GoogleApiWrapper, Polyline, Circle} from 'google-maps-react';
import React, { Component } from "react";

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            setter: false,
            street_id: [],
            show: false,
     };
     this.directionsCallback = this.directionsCallback.bind(this)
     
}
directionsCallback  = para => response => {
  
    if (response !== null) {

      if (response.status === 'OK') {
        const coords = response.routes[0].overview_path;
        this.state.response.push({'res':coords,'str_id':para});
        console.log(coords);
        this.setState({setter:true});
      } else {
        console.log('response: ', response)
      }
    }
    
  }
  add_street (id) {
    
        this.state.street_id.push(id);
  }
  sleep() {
    
  }
    render() {
      const center0 = {lat: 24.665618, lng: 46.698126};   
      console.log(this.props);  
         return (
             <Map
                 google={this.props.google}
                 containerStyle={{}}
                 style={{width: "92%", height: "600px"}}
                 center={center0}
                 initialCenter={center0}
                 zoom={12}
                 disableDefaultUI={true}
            >
                 {this.props.data.line.map((latlng)=>(
                     <Polyline
                        path={latlng.poly
                        }
                         strokeColor="red"
                         strokeOpacity={1}
                         strokeWeight={6}
                         onClick={() =>{  window.location.href ="/violation/"+latlng.street_id;  }}
                     />
                     
                     ))}

                {this.props.tree.line.map((latlng)=>(
                     <Polyline
                        path={latlng.poly
                        }
                         strokeColor="green"
                         strokeOpacity={1}
                         strokeWeight={6}
                         onClick={() =>{  window.location.href ="/violation/"+latlng.street_id;  }}
                     />
                     
                     ))}
                 {
                  this.props.data.circle.map((latlng)=>(
                    <Circle
                        radius={8}
                        center={latlng}
                        onClick={() =>{  window.location.href ="/violation/"+latlng[0].street_id;  }}
                        strokeColor='transparent'
                        strokeOpacity={0}
                        strokeWeight={5}
                        fillColor='#FF0000'
                        fillOpacity={0.8}
                      />
                  ))
                 }

                 {
                  this.props.tree.circle.map((latlng)=>(
                    <Circle
                        radius={8}
                        center={latlng}
                        strokeColor='transparent'
                        strokeOpacity={0}
                        strokeWeight={5}
                        fillColor='green'
                        fillOpacity={0.8}
                        onClick={() =>{  window.location.href ="/violation/"+latlng[0].street_id;  }}
                      />
                  ))
                 }
             </Map>
         );

        
    }
  }
   
export default GoogleApiWrapper({
     apiKey: sessionStorage.getItem("map_api")
   })(MapContainer)
