import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit , OnChanges{
  public chart: any;
  @Input() devicesInfo : any;
  deviceaddresscOunt = [];
  deviceCity = [];

  constructor(private http : HttpClient) { }

  ngOnChanges(){
      this.deviceCity = [];
     var deviceLocations = this.devicesInfo['allDevicesWithLocation'].map(x => x['location']);
      deviceLocations.forEach(element => {
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
          this.deviceaddresscOunt = Object.keys(map).map(key => ({type: key, value: map[key]}));
          this.ColumnChartsUpdate(this.deviceaddresscOunt);
        })
        }
      
      });
  }
  ngOnInit() {
  }
  ngAfterViewInit(){
  
  }

  public ColumnChartsUpdate(message) {
    const options : any  = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'column'
    },
    title: {
        text: 'Energy Comsumption by Places',
        align: 'left'
    },
    xAxis: {
      categories:  this.deviceaddresscOunt.map((x) => ( x['type'])),
      crosshair: true,
      // title: {
      // text: 'Date'
      // }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
            },
            showInLegend: true
        }
    },
    credits : {
      "cursor": "pointer", "color": "#999999", "fontSize": "10px"
    },
    colors : ['#377fd4' , '#3e90e1' , '#47a5f1'],
    series: [{
        showInLegend: false,
        // name: this.deviceaddresscOunt.map((x) => ( x['type'])),
        name : 'Total',
        colorByPoint: true,
    
      data: this.deviceaddresscOunt.map((x) => ({ name: x['type'], y: (x['value'])})),
      responsive: {
        rules: [{
          condition: {
            callback : undefined,
            maxWidth: 40,
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
    }]
  };
    this.chart = new Chart(<any> (options));
  }

}
