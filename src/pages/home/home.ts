import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

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
  public mapInitialize: boolean = false;
  public mLoader: any;
  public mLocationWatch: any;


  constructor(
    public navCtrl: NavController,
    public googleMaps: GoogleMaps,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  ionViewDidLeave() {
    this.mLocationWatch.unsubscribe();
  }

  showAlertMsg(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });

    alert.present();
  }

  showLoading(message) {
    this.mLoader = this.loadingCtrl.create({
      duration: 30000,
      content: message
      // spinner: 'hide',
      // showBackdrop: true,
      // enableBackdropDismiss: true,
      // dismissOnPageChange: true
    });

    if (this.mLoader != null) {
      this.mLoader.onDidDismiss(() => {
        // console.log('Dismissed loading');
      });

      this.mLoader.present();
    }
  }

  hideLoading() {
    if (this.mLoader != null) {
      this.mLoader.dismiss();
    }
  }

  loadMap() {
    this.mapInitialize = false;

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
      this.mapInitialize = true;

      this.getCurrentLocation();
    });
  }

  getCurrentLocation() {
    this.showLoading("Get Location...");

    this.geolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true,
    }).then((resp) => {
      if (resp != null) {
        if (resp.coords.latitude != null && resp.coords.longitude != null) {
          this.hideLoading();
          this.setLocationWatch();

          if (this.mapInitialize == true) {
            let location = new LatLng(resp.coords.latitude, resp.coords.longitude);
            this.setMarker(location);
          }
        }
      }
    }).catch((error) => {
      this.hideLoading();
      this.showAlertMsg("Error", error.message);
    });
  }

  setLocationWatch() {
    this.mLocationWatch = this.geolocation.watchPosition().subscribe(position => {
      console.log(position);
      // console.log(position.coords.longitude + ' ' + position.coords.latitude);
    });
  }

  setMarker(currentLocation) {
    if (currentLocation != null) {
      this.mCurrentLocation = currentLocation;
    }

    this.mGoogleMap.addMarker({
      title: '',
      icon: 'blue',
      animation: 'DROP',
      position: this.mCurrentLocation
    }).then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        // this.showAlertMsg("Marker", "Clicked...");
      });
    });
  }

}
