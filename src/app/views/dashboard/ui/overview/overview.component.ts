import { Component, OnInit ,  ViewChild, ElementRef, NgZone, Input, OnDestroy  } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import {Paho} from 'ng2-mqtt/mqttws31';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
declare const google: any;
import { Chart } from 'angular-highcharts';
import { DashboardService} from './../../dashboard.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit  {
 
  /* MQTT  */ 
  private client;
  mqttbroker = 'server.mux.life';
  lastActivity : any;
  time : any;
  
  /* Google Map */ 
  lat = 30.3753;
  lng = 69.3451;
  zoom : number;
  address: string;
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  markers = [];
  latSearch: number;
  lngSearch: number;
  fields: number[];
  ipAddress: any;
  
  /* Assign Properties  */
  devicesInfo : any; 
  deviceLocations : any;
  allDevicesConnected : any;
  totalClients : any ;
  devicesAddress : any;
  deviceaddresscOunt : any;
  deviceCity = [];


  constructor( private mapsAPILoader: MapsAPILoader,
               private ngZone: NgZone , 
               private http: HttpClient , 
               private dashboardService : DashboardService
              ) { }

  ngOnInit() {
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(9001), 'wxview');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});
    this.getLocation();
    
    setInterval(() => {
     this.dashboardService.getInfo().subscribe(data => {
      this.devicesInfo = data['body']['result']
      this.deviceLocations = this.devicesInfo['allDevicesWithLocation'].map(x => x['location']);
      this.allDevicesConnected = this.devicesInfo['allDevicesWithLocation'].map(x => x);
    })
    },60000 , true);
  }

  ngAfterViewInit(){
      this.dashboardService.getInfo().subscribe(data => {
      this.devicesInfo = data['body']['result'];
      this.deviceLocations = this.devicesInfo['allDevicesWithLocation'].map(x => x['location']);
      this.allDevicesConnected = this.devicesInfo['allDevicesWithLocation'].map(x => x);
      // debugger;
    })
  }


  public onConnect() {
    this.client.subscribe('saturn/#');
  }
  public onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
    }
  }
  public onMessageArrived(message)  {
    this.lastActivity = JSON.parse(message.payloadString);
    if(this.lastActivity['globalIp']){
      this.lastActivity = JSON.parse(message.payloadString);
      this.ipAddress =  this.lastActivity['globalIp'];
      this.latSearch = null;
      this.lngSearch = null;
      this.http.get('https://ipapi.co/'+this.ipAddress+'/json').subscribe(data => {
      this.totalClients = data;
      this.lastActivity = JSON.parse(message.payloadString);
      this.markers.push(data);
      var today = new Date();
      this.time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      this.latSearch = data['latitude'];
      this.lngSearch = data['longitude'];
      } , (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      });
    }
    var today = new Date();
    this.time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
  // public SetIpAddress(){
  //   this.latSearch = null;
  //   this.lngSearch = null;
  //   this.ipAddress = this.lastActivity ? this.lastActivity['globalIp'] : '';
  //   this.http.get<ILocData>('https://ipinfo.io/'+this.ipAddress+'/json').subscribe(data => {
  //   this.fields = data.loc.split(',');
  //   data.latSearch = this.fields[0];
  //   data.lngSearch = this.fields[1];
  //   this.latSearch = parseFloat(data.latSearch);
  //   this.lngSearch = parseFloat(data.lngSearch);
  //   });
  // }

  private getLocation(){
     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
 
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = google.maps.places.PlaceResult;
          place =  autocomplete.getPlace();
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          // this.lat = place.geometry.location.lat();
          // this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  private setCurrentLocation() {
    var LatLong = localStorage.getItem('user');
    var latLongInfo = JSON.parse(LatLong);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // this.lat = latLongInfo['location']['latitude'];
        // this.lng = latLongInfo['location']['longitude'];
        this.zoom = 8;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  private markerDragEnd($event: MouseEvent) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  private getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          // window.alert('No results found');
        }
      } else {
        // window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }
  
  public onMouseOver(infoWindow, gm) {
    if (gm.lastOpen && gm.lastOpen.isOpen) {
      gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }

  public onMouseOut(infoWindow, $event: MouseEvent) {
      infoWindow.close();
  }
  
  n
 
}
