import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;
  constructor() { }
  public chart: any;
  public chart1: any;
  ngOnInit() {
  }
  ngAfterViewInit(){
    this.ColumnChartsUpdate();
    this.testingCharts();
  }
  public ColumnChartsUpdate() {
    const options : any  = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'scatter',
        margin: [70, 50, 60, 80],
        events: {
            click: function (e) {
                // find the clicked values and the series
                var x = Math.round(e.xAxis[0].value),
                    y = Math.round(e.yAxis[0].value),
                    series = this.series[0];

                // Add it
                series.addPoint([x, y]);

            }
        }
    },
    title: {
      text: 'Running Hours',
      style: {
        color: '#F00',
        fontSize: '12px',
        textAlign : 'left'
     }
    },
    xAxis: {
      title: {
        text: 'days'
    },
    },
    yAxis: {
      title: {
          text: 'hours'
      },
    },
  legend: {
      enabled: false
  },
  exporting: {
      enabled: false
  },
  plotOptions: {
      series: {
          lineWidth: 1,
          point: {
              events: {
                  click: function () {
                      if (this.series.data.length > 1) {
                          this.remove();
                      }
                  }
              }
          }
      }
  },
  series: [{
      data: [2,4,5,55,9,12]
  }]
  };
    this.chart = new Chart(<any> (options));
  }

  public testingCharts() {
    const options : any  = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'spline',
        margin: [70, 50, 60, 80],
        events: {
            click: function (e) {
                // find the clicked values and the series
                var x = Math.round(e.xAxis[0].value),
                    y = Math.round(e.yAxis[0].value),
                    series = this.series[0];

                // Add it
                series.addPoint([x, y]);

            }
        }
    },
    title: {
      text: null
    },
    xAxis: {
      gridLineWidth: 1,
      minPadding: 0.2,
      maxPadding: 0.2,
      maxZoom: 60
    },
    yAxis: {
      title: {
          text: 'Value'
      },
      minPadding: 0.2,
      maxPadding: 0.2,
      maxZoom: 60,
      plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
      }]
    },
  legend: {
      enabled: false
  },
  exporting: {
      enabled: false
  },
  plotOptions: {
      series: {
          lineWidth: 1,
          point: {
              events: {
                  click: function () {
                      if (this.series.data.length > 1) {
                          this.remove();
                      }
                  }
              }
          }
      }
  },
  series: [{
      data: [[20, 20], [80, 80]]
  }]
  };
    this.chart1 = new Chart(<any> (options));
  }

}
