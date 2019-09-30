import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import {OverviewComponent} from '../../overview/overview.component';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  public chart: any;
  @Input() devicesInfo : any;
  deviceCount;
  devices = [];

  constructor() { }

  ngOnChanges(){
    var test = this.devicesInfo['allDevicesWithLocation'].map(x => 
    x['primaryDeviceType']['typeValue']);
    this.deviceCount = new Object();
    for(var i = 0; i < test.length; i++) {
    if(this.deviceCount[test[i]] != null) {
      this.deviceCount[test[i]] += 1;
    } else {
      this.deviceCount[test[i]] = 1;
      }
    }
    this.devices = Object.keys(this.deviceCount).map(key => ({type: key, value: this.deviceCount[key]}));
     this.devices.map(x => {
      if(x['type'] === 'SB3'){
        x['type'] = 'SwitchBoard';
      }else if(x['type'] === 'sol'){
        x['type'] = 'Smart Plug'
      }else if(x['type'] === 'SBS'){
        x['type'] = 'Smart Blind'
      }else if(x['type'] === 'sdf'){
        x['type'] = 'Smart Dimmer'
      }else if(x['type'] === 'SWS'){
        x['type'] = 'Wall Socket'
      }else if(x['type'] === 'STX'){
        x['type'] = 'Smart Remote'
      }else if(x['type'] === 'MSL'){
        x['type'] = 'Smart Light'
      }
    })
    this.barChartUpdate(this.devices);
  }
  
  ngOnInit() {
  }

  
  ngAfterViewInit(){
  }
  public barChartUpdate(message) {
    const options : any  = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Total Devices',
        align: 'left'
    },
    // tooltip: {
    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    // },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.0f}'
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Total',
        colorByPoint: true,
    
      data: this.devices.map((x) => ({ name: x['type'], y: (x['value'])})),
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
    }]
  };
    this.chart = new Chart(<any> (options));
  }
}
