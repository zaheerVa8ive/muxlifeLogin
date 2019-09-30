import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import * as mqttt from "mqtt";
import { SitesService } from "../../sites.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { environment } from "../../../../../environments/environment";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-dimmer-socket",
  templateUrl: "./dimmer-socket.component.html",
  styleUrls: ["./dimmer-socket.component.scss"]
})
export class DimmerSocketComponent implements OnInit {
  deviceObject: any;
  state: boolean;
  switchType: any;
  client: any;
  roomId: any;
  constructor(
    public siteService: SitesService,
    public appLoaderService: AppLoaderService,
    public dialogRef: MatDialogRef<DimmerSocketComponent>,
    public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log("this.data", this.data);
    if (this.data["device"]) {
      this.deviceObject = this.data["device"];
    } else {
      this.deviceObject = this.data;
    }
    this.roomId = this.deviceObject["objectId"];
    this.switchType = this.deviceObject["deviceSetting"]["dimmerStateType"][
      "typeValue"
    ];
    if (this.data["state"]) {
      this.state = true;
      this.switchType = "off";
    }
  }

  onNoClick(): void {
    if (this.data["state"]) {
      this.dialogRef.close(this.switchType);
    } else {
      this.dialogRef.close();
      this.siteService.associatedRoomDevices(this.roomId).subscribe(data => {
        this.deviceObject = data["results"];
      });
    }
  }
  dimmerSwitch(type, deviceObject) {
    var macaddress = deviceObject["macAddress"];
    if (type === 1) {
      this.switchType = deviceObject["deviceSetting"]["dimmerStateType"][
        "typeValue"
      ] = "off";
      var payload = {
        mac: macaddress,
        state: deviceObject["deviceSetting"]["dimmerStateType"]["typeValue"] =
          "off",
        dimState: "0",
        user: "HaiderM",
        cmd: "action",
        lastActionPlatform: "Dashboard",
        lastActionTime: 1539604000,
        mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
        appVersion: "0.0.1"
      };
      this.client = mqttt.connect(environment.mqttClient);
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
      this.switchType = deviceObject["deviceSetting"]["dimmerStateType"][
        "typeValue"
      ] = "on";
      var payload = {
        mac: macaddress,
        state: deviceObject["deviceSetting"]["dimmerStateType"]["typeValue"] =
          "on",
        dimState: "0",
        user: "HaiderM",
        cmd: "action",
        lastActionPlatform: "Dashboard",
        lastActionTime: 1539604000,
        mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
        appVersion: "0.0.1"
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

  dimmerSocketEvent(ev, deviceObject) {
    var macaddress = deviceObject["macAddress"];
    var payload = {
      mac: macaddress,
      state: "dim",
      dimState: deviceObject["deviceSetting"]["dimPercentage"] = ev.value,
      user: "HaiderM",
      cmd: "action",
      lastActionPlatform: "Dashboard",
      lastActionTime: 1539604000,
      mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
      appVersion: "0.0.1"
    };
    this.client = mqttt.connect(environment.mqttClient);
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
        this.client.subscribe(
          `saturn/reported/${macaddress}`,
          (done, err) => {}
        );
      });
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

  dimmerSwitchState(type, deviceObject) {
    console.log("type , deviceObject", type, deviceObject);
    if (type == 0) {
      this.switchType = "on";
    } else {
      this.switchType = "off";
    }
  }
}
