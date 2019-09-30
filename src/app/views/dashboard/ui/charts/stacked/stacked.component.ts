import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-stacked',
  templateUrl: './stacked.component.html',
  styleUrls: ['./stacked.component.scss']
})
export class StackedComponent implements OnInit {
  public chart: any;
  @Input() devicesInfo : any;
  deviceLocations : any;
  totalClients : any ;
  deviceaddresscOunt = [];
  deviceCity = [];
  devicenameCounts :  any;
  devices = [];

  constructor(private http : HttpClient) { }

  ngOnInit() {
  }
  ngOnChanges(){
    this.deviceCity = [];
    // debugger;
      this.deviceLocations = this.devicesInfo['allDevicesWithLocation'].map(x => x['location']);
      this.deviceLocations.forEach(element => {
        if(element !== undefined){
          this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+element['latitude']+','+element['longitude']+'&key=AIzaSyAIB73_M36MiQtAXNhYBQudnphyHeRZXHs').subscribe(data =>{
          // debugger;
          var devicesAddress = data['results'][0].formatted_address;
          var value = devicesAddress.split(",");
          var count=value.length;
          var country = value[count-1];
          var state = value[count-2];
          var city  = value[count-3];
          this.deviceCity.push(city);
          var map = new Object();

          for(var i = 0; i < this.deviceCity.length; i++) {
           if(map[this.deviceCity[i]] != null) {
              map[this.deviceCity[i]] += 1;
          } else  {
              map[this.deviceCity[i]] = 1;
            }
          }
          // var test = this.devicesInfo['allDevicesWithLocation'].map(x => 
          //   x['primaryDeviceType']['typeValue']);
          //   for(var i = 0; i < test.length; i++) {
          //     if(map[test[i]] != null) {
          //        map[test[i]] += 1;
          //    } else  {
          //        map[test[i]] = 1;
          //        var payLoad = {
          //         city : city,
          //         deviceName : 
          //       }
          //      }
          //    }
  
          // var x  = Object.keys(map1).map(key => ({type: key, value: map1[key]}));

          this.deviceaddresscOunt = Object.keys(map).map(key => ({type: key, value: map[key]}));
          this.stackedChartUpdate(this.deviceaddresscOunt);
        })
        }
      
      });

      // var newArr = [];

      // var test = this.devicesInfo['allDevicesWithLocation'].map(x => 
      //   x['primaryDeviceType']['typeValue']);
      //   test.forEach(element1 => {
      //   newArr.push(element1);
      //     var map1 = new Object();
      //     for(var i = 0; i < newArr.length; i++) {
      //       if(map1[newArr[i]] != null) {
      //         map1[newArr[i]] += 1;
      //      } else  {
      //       map1[newArr[i]] = 1;
      //        }
      //      }
      //      var payLoad = {
      //        city : this.deviceCity,
      //        deviceName : newArr
      //      }
      //      var x  = Object.keys(map1).map(key => ({type: key, value: map1[key]}));
      //     });
       // counting devices accordingly the city.
      //  debugger;
      //  var devicenameCounts : any =  this.devicesInfo['allDevicesWithLocation'].map(x => 
      //   ([x['primaryDeviceType']['typeValue'] , x['location']]));
      //   for(var i = 0; i < devicenameCounts.length; i++) {
      //     if(this.devicenameCounts[devicenameCounts[i]] != null) {
      //       this.devicenameCounts[devicenameCounts[i]] += 1;
      //     } else {
      //       this.devicenameCounts[devicenameCounts[i]] = 1;
      //       }
      //     }
      // this.devices = Object.keys(this.devicenameCounts).map(key => ({type: key, value: this.devicenameCounts[key]}));  
  }
  public stackedChartUpdate(message) {
    // const value: any[] =  this.activity.map((x) => [x['dateString'], x['count']]);
    const options : any  = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'bar'
      },
      title: {
        text: 'Total Devices',
      },
      xAxis: {
        categories:  this.deviceaddresscOunt.map((x) => ( x['type'])),
        crosshair: true,
        // title: {
        // text: 'Date'
        // }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Total devices installed by citites'
        }
      },
      legend: {
        reversed: true
      },
      // tooltip: {
      //   shared: true,
      //   crosshairs: true
      // },
      plotOptions: {
        series: {
          stacking: 'normal'
      }
      },
      series: [{
      name: this.deviceaddresscOunt.map((x) => (x['type'])),
      colorByPoint: true,
      data: this.deviceaddresscOunt.map((x) => ({ name: x['type'], y: (x['value'])}))
  }] ,
      responsive: {
        rules: [{
          condition: {
            callback : undefined,
            maxWidth: 100,
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
  };
    this.chart = new Chart(options);
  }

}
