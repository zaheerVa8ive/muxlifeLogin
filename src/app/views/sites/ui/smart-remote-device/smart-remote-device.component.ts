import { Component, OnInit, AfterViewInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { SitesService } from "../../sites.service";
import * as mqttt from "mqtt";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { MatSnackBar } from "@angular/material";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";

@Component({
  selector: "app-smart-remote-device",
  templateUrl: "./smart-remote-device.component.html",
  styleUrls: ["./smart-remote-device.component.scss"]
})
export class SmartRemoteDeviceComponent implements OnInit, AfterViewInit {
  smartRemoteDeviceOject: any;
  deviceObject: any;
  payload : any;
  deviceState : any = false;
  tempObj = [
    "off",
    "on",
    "temp16",
    "temp17",
    "temp18",
    "temp19",
    "temp20",
    "temp21",
    "temp22",
    "temp23",
    "temp24",
    "temp25",
    "temp26",
    "temp27",
    "temp28"
  ];
  client: any;
  deviceType: any;
  playSwitch: boolean = true;
  tvSwtich: boolean = false;
  constructor(
    public siteService: SitesService,
    public appLoaderService: AppLoaderService,
    public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SmartRemoteDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    if ( this.data['deviceState']){
      this.dialogRef.close(this.payload);
    } else {
      this.dialogRef.close();
    }
  }
  ngOnInit() {
    console.log("54 , this.data",this.data);
    if (this.data['deviceState']){
      this.deviceState = true;
    }
    this.smartRemoteDeviceOject = this.data;
    this.deviceType = this.smartRemoteDeviceOject["remoteDeviceType"][
      "typeValue"
    ];
  }
  ngAfterViewInit() {
    if (this.deviceType == "AC") {
      this.remoteDeviceTypeAcApi();
    } else if (this.deviceType == "TV") {
      this.remoteDeviceTypeTvApi();
    } else {
      this.remoteDeviceTypeMultiMediaApi();
    }
  }
  public remoteDeviceTypeAcApi() {
    var deviceType = this.smartRemoteDeviceOject["remoteDeviceType"][
      "typeValue"
    ];
    var deviceModel = this.smartRemoteDeviceOject["remoteDeviceModel"]["make"][
      "name"
    ];
    var deviceModelName = this.smartRemoteDeviceOject["remoteDeviceModel"][
      "name"
    ];
    this.siteService
      .remoteDeviceAcMake(deviceType, deviceModel, deviceModelName)
      .subscribe(data => {
        this.deviceObject = data["results"]["0"];
        console.log("getting info of ac", this.deviceObject);
      });
  }
  public remoteDeviceTypeTvApi() {
    var deviceType = this.smartRemoteDeviceOject["remoteDeviceType"][
      "typeValue"
    ];
    var deviceModel = this.smartRemoteDeviceOject["remoteDeviceModel"]["make"][
      "name"
    ];
    var deviceModelName = this.smartRemoteDeviceOject["remoteDeviceModel"][
      "name"
    ];
    this.siteService
      .remoteDeviceTvMake(deviceType, deviceModel, deviceModelName)
      .subscribe(data => {
        this.deviceObject = data["results"]["0"];
      });
  }
  public remoteDeviceTypeMultiMediaApi() {
    var deviceType = this.smartRemoteDeviceOject["remoteDeviceType"][
      "typeValue"
    ].toLowerCase();
    var deviceModel = this.smartRemoteDeviceOject["remoteDeviceModel"]["make"][
      "name"
    ].toLowerCase();
    var deviceModelName = this.smartRemoteDeviceOject["remoteDeviceModel"][
      "name"
    ];
    this.siteService
      .remoteDeviceMultiMediaMake(deviceType, deviceModel, deviceModelName)
      .subscribe(data => {
        this.deviceObject = data["results"]["0"];
      });
  }
  public smartRempteTypeAc(ev) {
    var macaddress = this.smartRemoteDeviceOject["device"]["macAddress"];
    var rawsignal = this.deviceObject[ev.value];
    console.log("signal pass", rawsignal);
    var signal = rawsignal.split("\n")[0].replace(/,\s*$/, "");
    var splittedstring = signal.split(",").length;
    console.log(this.deviceObject["arraySize"]);
    var payload = {
      cmd: "action",
      mac: macaddress,
      state: "on",
      appVersion: "2.6",
      lastActionPlatform: "Dashboard",
      lastActionTime: "1549436314",
      mobileId: "a5e632086cf08841",
      deviceType: "STX",
      user: "rasa asad khan",
      arraySize: this.deviceObject["arraySize"],
      remoteId: "1",
      signal: signal
    };
    console.log("payload", payload);
    this.client = mqttt.connect("ws://server.mux.life:9001");
    this.client.on("connect", () => {
      this.client.subscribe(`saturn/desired/${macaddress}`, err => {
        this.appLoaderService.open();
        if (err) throw err;
        this.client.publish(
          `saturn/desired/${macaddress}`,
          JSON.stringify(payload)
        );
        setTimeout(() => {
          this.appLoaderService.close();
        }, 5000);
      });
      this.client.subscribe(`saturn/reported/${macaddress}`, (done, err) => {});
    });
    this.client.on("message", async (topic, message) => {
      let checkStatus = JSON.parse(message.toString());
      await setTimeout(() => {
        console.log(message.toString());
        console.log(checkStatus);
        switch (checkStatus["cmd"]) {
          case "actionAck":
            setTimeout(() => {
              this.appLoaderService.close();
            }, 1000);
            this._snackBar.openFromComponent(
              DeviceStatusCheckFormComponent,
              {
                duration: 5 * 1000,
                data: "Device Successfully triggered!"
              }
            );
            break;
          case "action":
            this._snackBar.openFromComponent(
              DeviceStatusCheckFormComponent,
              {
                duration: 1 * 1000,
                data: "Device status pending"
              }
            );
            // setTimeout(() => {
            if (checkStatus["cmd"] != "actionAck") {
              this.appLoaderService.close();
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device not responding!"
                }
              );
            }
            // }, 0);
            break;
          default:
            console.log("not responding device");
            break;
        }
        this.client.end();
      }, 1000);
    });
  }

  smartRempteTypeAcState(ev){
    var rawsignal = this.deviceObject[ev.value];
    console.log("signal pass", rawsignal);
    var signal = rawsignal.split("\n")[0].replace(/,\s*$/, "");
    console.log(this.deviceObject["arraySize"]);
    var payload = {
      dimPercentage: 0,
      deviceState: false,
      switch3State: false,
      switch1State: false,
      switch2State: false,
      arraySize: this.deviceObject["arraySize"],
      signal: signal,
      acTemperatureSetting : ev.value
    };
    console.log("payload", payload);
    this.payload = payload;
  }
  smartRemoteTypeTvState(e, deviceType){
    var signal = this.deviceObject[deviceType];
    var payload ;
    if (e === 1) {
      this.tvSwtich = false;
        payload = {
          dimPercentage: 0,
          deviceState: false,
          switch3State: false,
          switch1State: false,
          switch2State: false,
          arraySize: this.deviceObject["arraySize"],
          signal: signal,
          acTemperatureSetting : "on"
      };
    } else {
      this.tvSwtich = true;
        payload = {
          dimPercentage: 0,
          deviceState: false,
          switch3State: false,
          switch1State: false,
          switch2State: false,
          arraySize: this.deviceObject["arraySize"],
          signal: signal,
          acTemperatureSetting : "on"
      };
    }
    this.payload = payload;
  }

  smartRemoteTypeMultiState(e, deviceType){
    var signal = this.deviceObject[deviceType];
    var payload;

    if (e === 1) {
      this.playSwitch = false;
        payload = {
          dimPercentage: 0,
          deviceState: false,
          switch3State: false,
          switch1State: false,
          switch2State: false,
          arraySize:this.deviceObject["arraySize"],
          signal: signal,
          acTemperatureSetting : "on"
      };
    } else {
      this.playSwitch = true;
        payload = {
          dimPercentage: 0,
          deviceState: false,
          switch3State: false,
          switch1State: false,
          switch2State: false,
          arraySize:this.deviceObject["arraySize"],
          signal: signal,
          acTemperatureSetting : "on"
      };
    }
    this.payload = payload;
  }
  public smartRemoteTypeMulti(e, deviceType) {
    var signal = this.deviceObject[deviceType];
    var macaddress = this.smartRemoteDeviceOject["device"]["macAddress"];

    if (e === 1) {
      this.playSwitch = false;
      var payload = {
        cmd: "action",
        mac: macaddress,
        state: "on",
        appVersion: "2.6",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1549436314",
        mobileId: "a5e632086cf08841",
        deviceType: "STX",
        user: "rasa asad khan",
        arraySize: "243",
        remoteId: "1",
        signal: signal
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macaddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macaddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });
        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
      this.client.on("message", async (topic, message) => {
        let checkStatus = JSON.parse(message.toString());
        await setTimeout(() => {
          console.log(message.toString());
          console.log(checkStatus);
          switch (checkStatus["cmd"]) {
            case "actionAck":
              setTimeout(() => {
                this.appLoaderService.close();
              }, 1000);
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device Successfully triggered!"
                }
              );
              break;
            case "action":
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 1 * 1000,
                  data: "Device status pending"
                }
              );
              // setTimeout(() => {
              if (checkStatus["cmd"] != "actionAck") {
                this.appLoaderService.close();
                this._snackBar.openFromComponent(
                  DeviceStatusCheckFormComponent,
                  {
                    duration: 5 * 1000,
                    data: "Device not responding!"
                  }
                );
              }
              // }, 0);
              break;
            default:
              console.log("not responding device");
              break;
          }
          this.client.end();
        }, 1000);
      });
    } else if (e === 2) {
      this.playSwitch = true;
      var payload = {
        cmd: "action",
        mac: macaddress,
        state: "on",
        appVersion: "2.6",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1549436314",
        mobileId: "a5e632086cf08841",
        deviceType: "STX",
        user: "rasa asad khan",
        arraySize: "243",
        remoteId: "1",
        signal: signal
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macaddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macaddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });

        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
      this.client.on("message", async (topic, message) => {
        let checkStatus = JSON.parse(message.toString());
        await setTimeout(() => {
          console.log(message.toString());
          console.log(checkStatus);
          switch (checkStatus["cmd"]) {
            case "actionAck":
              setTimeout(() => {
                this.appLoaderService.close();
              }, 1000);
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device Successfully triggered!"
                }
              );
              break;
            case "action":
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 1 * 1000,
                  data: "Device status pending"
                }
              );
              // setTimeout(() => {
              if (checkStatus["cmd"] != "actionAck") {
                this.appLoaderService.close();
                this._snackBar.openFromComponent(
                  DeviceStatusCheckFormComponent,
                  {
                    duration: 5 * 1000,
                    data: "Device not responding!"
                  }
                );
              }
              // }, 0);
              break;
            default:
              console.log("not responding device");
              break;
          }
          this.client.end();
        }, 1000);
      });
    } else {
      var payload = {
        cmd: "action",
        mac: macaddress,
        state: "on",
        appVersion: "2.6",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1549436314",
        mobileId: "a5e632086cf08841",
        deviceType: "STX",
        user: "rasa asad khan",
        arraySize: "243",
        remoteId: "1",
        signal: signal
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macaddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macaddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });

        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
      this.client.on("message", async (topic, message) => {
        let checkStatus = JSON.parse(message.toString());
        await setTimeout(() => {
          console.log(message.toString());
          console.log(checkStatus);
          switch (checkStatus["cmd"]) {
            case "actionAck":
              setTimeout(() => {
                this.appLoaderService.close();
              }, 1000);
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device Successfully triggered!"
                }
              );
              break;
            case "action":
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 1 * 1000,
                  data: "Device status pending"
                }
              );
              // setTimeout(() => {
              if (checkStatus["cmd"] != "actionAck") {
                this.appLoaderService.close();
                this._snackBar.openFromComponent(
                  DeviceStatusCheckFormComponent,
                  {
                    duration: 5 * 1000,
                    data: "Device not responding!"
                  }
                );
              }
              // }, 0);
              break;
            default:
              console.log("not responding device");
              break;
          }
          this.client.end();
        }, 1000);
      });
    }
  }
  public smartRemoteTypeTv(e, deviceType) {
    var signal = this.deviceObject[deviceType];
    var macaddress = this.smartRemoteDeviceOject["device"]["macAddress"];
    if (e === 1) {
      this.tvSwtich = false;
      var payload = {
        cmd: "action",
        mac: macaddress,
        state: "on",
        appVersion: "2.6",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1549436314",
        mobileId: "a5e632086cf08841",
        deviceType: "STX",
        user: "rasa asad khan",
        arraySize: "243",
        remoteId: "1",
        signal: signal
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macaddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macaddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });

        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
      this.client.on("message", async (topic, message) => {
        let checkStatus = JSON.parse(message.toString());
        await setTimeout(() => {
          console.log(message.toString());
          console.log(checkStatus);
          switch (checkStatus["cmd"]) {
            case "actionAck":
              setTimeout(() => {
                this.appLoaderService.close();
              }, 1000);
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device Successfully triggered!"
                }
              );
              break;
            case "action":
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 1 * 1000,
                  data: "Device status pending"
                }
              );
              // setTimeout(() => {
              if (checkStatus["cmd"] != "actionAck") {
                this.appLoaderService.close();
                this._snackBar.openFromComponent(
                  DeviceStatusCheckFormComponent,
                  {
                    duration: 5 * 1000,
                    data: "Device not responding!"
                  }
                );
              }
              // }, 0);
              break;
            default:
              console.log("not responding device");
              break;
          }
          this.client.end();
        }, 1000);
      });
    } else if (e === 0) {
      this.tvSwtich = true;
      var payload = {
        cmd: "action",
        mac: macaddress,
        state: "on",
        appVersion: "2.6",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1549436314",
        mobileId: "a5e632086cf08841",
        deviceType: "STX",
        user: "rasa asad khan",
        arraySize: "243",
        remoteId: "1",
        signal: signal
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macaddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macaddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });

        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
      this.client.on("message", async (topic, message) => {
        let checkStatus = JSON.parse(message.toString());
        await setTimeout(() => {
          console.log(message.toString());
          console.log(checkStatus);
          switch (checkStatus["cmd"]) {
            case "actionAck":
              setTimeout(() => {
                this.appLoaderService.close();
              }, 1000);
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device Successfully triggered!"
                }
              );
              break;
            case "action":
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 1 * 1000,
                  data: "Device status pending"
                }
              );
              // setTimeout(() => {
              if (checkStatus["cmd"] != "actionAck") {
                this.appLoaderService.close();
                this._snackBar.openFromComponent(
                  DeviceStatusCheckFormComponent,
                  {
                    duration: 5 * 1000,
                    data: "Device not responding!"
                  }
                );
              }
              // }, 0);
              break;
            default:
              console.log("not responding device");
              break;
          }
          this.client.end();
        }, 1000);
      });
    } else {
      var payload = {
        cmd: "action",
        mac: macaddress,
        state: "on",
        appVersion: "2.6",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1549436314",
        mobileId: "a5e632086cf08841",
        deviceType: "STX",
        user: "rasa asad khan",
        arraySize: "243",
        remoteId: "1",
        signal: signal
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macaddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macaddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });

        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
      this.client.on("message", async (topic, message) => {
        let checkStatus = JSON.parse(message.toString());
        await setTimeout(() => {
          console.log(message.toString());
          console.log(checkStatus);
          switch (checkStatus["cmd"]) {
            case "actionAck":
              setTimeout(() => {
                this.appLoaderService.close();
              }, 1000);
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 5 * 1000,
                  data: "Device Successfully triggered!"
                }
              );
              break;
            case "action":
              this._snackBar.openFromComponent(
                DeviceStatusCheckFormComponent,
                {
                  duration: 1 * 1000,
                  data: "Device status pending"
                }
              );
              // setTimeout(() => {
              if (checkStatus["cmd"] != "actionAck") {
                this.appLoaderService.close();
                this._snackBar.openFromComponent(
                  DeviceStatusCheckFormComponent,
                  {
                    duration: 5 * 1000,
                    data: "Device not responding!"
                  }
                );
              }
              // }, 0);
              break;
            default:
              console.log("not responding device");
              break;
          }
          this.client.end();
        }, 1000);
      });
    }
  }
}
