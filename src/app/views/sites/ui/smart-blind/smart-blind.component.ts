import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { SitesService } from "../../sites.service";
import * as mqttt from "mqtt";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";
import { MatSnackBar } from "@angular/material";
@Component({
  selector: "app-smart-blind",
  templateUrl: "./smart-blind.component.html",
  styleUrls: ["./smart-blind.component.scss"]
})
export class SmartBlindComponent implements OnInit {
  smartBlindDeviceObject: any;
  deviceDefaultState: any;
  playSwitch: Boolean = false;
  client: any;
  deviceState: boolean;
  constructor(
    private siteSerivce: SitesService,
    public appLoaderService: AppLoaderService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SmartBlindComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log("this.data", this.data);

    if (this.data["device"]) {
      this.smartBlindDeviceObject = this.data["device"];
    } else {
      this.smartBlindDeviceObject = this.data;
    }
    console.log(this.smartBlindDeviceObject);
    this.deviceDefaultState = this.smartBlindDeviceObject["deviceSetting"][
      "smartBlindsStateType"
    ]["typeValue"];
  }

  public smartBlindControl(DeviceState, DeviceObject) {
    var smartBlindState = DeviceObject["deviceSetting"]["smartBlindsStateType"];
    var macAdress = DeviceObject["macAddress"];
    var payload;
    if (DeviceState === "off") {
      payload = {
        state: ((smartBlindState["objectId"] = "MBp3Bv68zN"),
        (smartBlindState["typeValue"] = "off")),
        appVersion: "1.1",
        cmd: "action",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1562650252286",
        mac: macAdress,
        user: "RASA",
        mobileId: "deed9ec7-bd50-4b6a-bb9c-9b4fef0bf9f1"
      };
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macAdress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macAdress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });
          this.client.subscribe(
            `saturn/reported/${macAdress}`,
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
    } else if (DeviceState === "pause") {
      payload = {
        state: ((smartBlindState["objectId"] = "Y0f8kFeKJG"),
        (smartBlindState["typeValue"] = "pause")),
        appVersion: "1.1",
        cmd: "action",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1562650252286",
        mac: macAdress,
        user: "RASA",
        mobileId: "deed9ec7-bd50-4b6a-bb9c-9b4fef0bf9f1"
      };
      // this.client = mqttt.connect('ws://server.mux.life:9001');
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macAdress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macAdress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
        });
          this.client.subscribe(
            `saturn/reported/${macAdress}`,
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
      payload = {
        state: ((smartBlindState["objectId"] = "8Jt9nNwoet"),
        (smartBlindState["typeValue"] = "on")),
        appVersion: "1.1",
        cmd: "action",
        lastActionPlatform: "Dashboard",
        lastActionTime: "1562650252286",
        mac: macAdress,
        user: "RASA",
        mobileId: "deed9ec7-bd50-4b6a-bb9c-9b4fef0bf9f1"
      };
      // this.client = mqttt.connect('ws://server.mux.life:9001');
      this.client = mqttt.connect("ws://server.mux.life:9001");
      this.client.on("connect", () => {
        this.client.subscribe(`saturn/desired/${macAdress}`, err => {
          this.appLoaderService.open();
          if (err) throw err;
          this.client.publish(
            `saturn/desired/${macAdress}`,
            JSON.stringify(payload)
          );
          setTimeout(() => {
            this.appLoaderService.close();
          }, 5000);
       });
          
          this.client.subscribe(
            `saturn/reported/${macAdress}`,
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

  public onNoClick(): void {
    if (this.data.state) {
      this.dialogRef.close(this.deviceState);
    } else {
      this.dialogRef.close();
    }
  }

  smartBlindState(DeviceState) {
    this.deviceState = DeviceState;
    console.log("DeviceState", DeviceState);
  }
}
