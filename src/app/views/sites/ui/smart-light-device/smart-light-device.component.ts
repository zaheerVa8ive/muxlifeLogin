import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import * as mqttt from "mqtt";
import { environment } from "../../../../../environments/environment";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";

@Component({
  selector: "app-smart-light-device",
  templateUrl: "./smart-light-device.component.html",
  styleUrls: ["./smart-light-device.component.scss"]
})
export class SmartLightDeviceComponent implements OnInit {
  client: any;
  deviceObject: any;
  rgbLightColors: any;
  deviceBrightness: any;
  deviceCurrentState;
  brightness: any;
  state: boolean;
  constructor(
    public appLoaderService: AppLoaderService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SmartLightDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log("this.data", this.data);
    if (this.data["state"]) {
      this.state = true;
    }
    if (this.data["device"]) {
      this.deviceObject = this.data["device"];
    } else {
      this.deviceObject = this.data;
    }
    console.log("this.data", this.data);
    let rgb = ["L0", "0", "0", "0", "0", ""];
    if (this.deviceObject.rgbwColorCodes) {
      rgb = this.deviceObject.rgbwColorCodes.split(",");
    }
    console.log("rgb", rgb);
    this.rgbLightColors = `${rgb[1]},${rgb[2]},${rgb[3]}`;
    this.deviceBrightness = `${rgb[4]}`;
    this.deviceCurrentState = `${rgb[0]}`;
  }
  public SmartLightFunction(e, stateType, devicefunctionObject) {
    var colorType;
    var brightness;
    var maccAdress = devicefunctionObject["macAddress"];
    if (stateType == 1) {
      let smartLightColors = e["color"]["rgb"];
      let rgbColors = `${smartLightColors["r"]},${smartLightColors["g"]},${smartLightColors["b"]}`;
      colorType = rgbColors;
      this.rgbLightColors = colorType;
      brightness = this.deviceBrightness;
    } else {
      brightness = e["value"];
      colorType = this.rgbLightColors;
    }
    console.log("colorType", colorType);
    var payload = {
      cmd: "action",
      user: "RasaAsadKhan",
      mac: maccAdress,
      rgbwColorCodes: `L1,${colorType},${brightness},`,
      mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
      appVersion: "2.4",
      lastActionTime: 1539604000,
      lastActionPlatform: "Dashboard"
    };
    this.client = mqttt.connect(environment.mqttClient);
    this.client.on("connect", () => {
      this.client.subscribe(`saturn/desired/${maccAdress}`, err => {
        this.appLoaderService.open();
        if (err) throw err;
        this.client.publish(
          `saturn/desired/${maccAdress}`,
          JSON.stringify(payload)
        );
        setTimeout(() => {
          this.appLoaderService.close();
        }, 2000);
        this.client.end();
      });
      this.client.subscribe(`saturn/reported/${maccAdress}`, (done, err) => {});
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
            this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
              duration: 5 * 1000,
              data: "Device Successfully triggered!"
            });
            break;
          case "action":
            this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
              duration: 1 * 1000,
              data: "Device status pending"
            });
            // setTimeout(() => {
            if (checkStatus["cmd"] != "actionAck") {
              this.appLoaderService.close();
              this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
                duration: 5 * 1000,
                data: "Device not responding!"
              });
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
  public smartLightSwitch(devicefunctionObject, switchState) {
    console.log("devicefunctionObject", devicefunctionObject);
    var macAddress = devicefunctionObject["macAddress"];
    if (switchState === "L1") {
      this.deviceCurrentState = "L0";
      var payload = {
        cmd: "action",
        user: "RasaAsadKhan",
        mac: macAddress,
        rgbwColorCodes: `L0,0,0,0,0,`,
        mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
        appVersion: "2.4",
        lastActionTime: 1539604000,
        lastActionPlatform: "Dashboard"
      };
      this.client = mqttt.connect(environment.mqttClient);
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macAddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macAddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 2000);
          this.client.end();
        });
        this.client.subscribe(
          `saturn/reported/${macAddress}`,
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
              this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
                duration: 5 * 1000,
                data: "Device Successfully triggered!"
              });
              break;
            case "action":
              this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
                duration: 1 * 1000,
                data: "Device status pending"
              });
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
      this.deviceCurrentState = "L1";
      var payload = {
        cmd: "action",
        user: "RasaAsadKhan",
        mac: macAddress,
        rgbwColorCodes: `L1,0,0,0,0,`,
        mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
        appVersion: "2.4",
        lastActionTime: 1539604000,
        lastActionPlatform: "Dashboard"
      };
      this.client = mqttt.connect(environment.mqttClient);
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macAddress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macAddress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 2000);
          this.client.end();
        });
        this.client.subscribe(
          `saturn/reported/${macAddress}`,
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
              this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
                duration: 5 * 1000,
                data: "Device Successfully triggered!"
              });
              break;
            case "action":
              this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
                duration: 1 * 1000,
                data: "Device status pending"
              });
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

  public SmartLightState(e, stateType, devicefunctionObject) {
    var colorType;
    var brightness;
    if (stateType == 1) {
      let smartLightColors = e["color"]["rgb"];
      let rgbColors = `${smartLightColors["r"]},${smartLightColors["g"]},${smartLightColors["b"]}`;
      colorType = rgbColors;
      this.rgbLightColors = colorType;
      this.brightness = this.deviceBrightness;
    } else {
      this.brightness = e["value"];
      colorType = this.rgbLightColors;
    }
    console.log("colorType", colorType);
  }
  public onNoClick(): void {
    if (this.data["state"]) {
      let rgbwColorCodes = `L1,${this.rgbLightColors},${this.brightness},`;
      this.dialogRef.close(rgbwColorCodes);
    } else {
      this.dialogRef.close();
    }
  }
}
