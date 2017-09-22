import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  public mGoogleMap: GoogleMap;
  public mapElement: HTMLElement;
  public mapOptions: GoogleMapOptions;
  public mCurrentLocation = new LatLng(22.2799913, 70.7754111);

  constructor(
    public navCtrl: NavController,
    public googleMaps: GoogleMaps,
    public geolocation: Geolocation) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.mapElement = document.getElementById('map');

    this.mapOptions = {
      camera: {
        target: this.mCurrentLocation,
        zoom: 18,
        tilt: 30
      }
    };

    this.mGoogleMap = this.googleMaps.create(this.mapElement, this.mapOptions);

    this.mGoogleMap.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.mGoogleMap.addMarker({
        title: 'Ionic',
        icon: 'blue',
        animation: 'DROP',
        position: this.mCurrentLocation
      }).then(marker => {
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          alert('clicked');
        });
      });
    });
  }

}
