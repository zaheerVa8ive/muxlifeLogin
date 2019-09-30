import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { MatSlideToggleChange, MatTabChangeEvent } from "@angular/material";
import * as mqttt from "mqtt";
import { Location } from "@angular/common";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { SitesService } from "../../sites.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { SwitchboardSocketComponent } from "../switchboard-socket/switchboard-socket.component";
import { SmartRemoteOverviewComponent } from "../smart-remote-overview/smart-remote-overview.component";
import { DimmerSocketComponent } from "../dimmer-socket/dimmer-socket.component";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { SmartBlindComponent } from "../smart-blind/smart-blind.component";
import { environment } from "../../../../../environments/environment";
import { MatSnackBar } from "@angular/material";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";
import { SmartLightDeviceComponent } from "../smart-light-device/smart-light-device.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  public useDefaultState: any;
  toggleValue = true;
  client: any;
  userRooms: [];
  getallDevices: [];
  userobjectId : any;
  roomsInfo: any;
  asoociatedDevicesRoom: [];
  smartBlindState: any;
  smartSocketObject: any;
  associatedObjectId: any;
  deiveStatusFlag: boolean = false;

  constructor(
    private _location: Location,
    private _snackBar: MatSnackBar,
    private _http: HttpClient,
    private siteServices: SitesService,
    public dialog: MatDialog,
    public appLoaderService: AppLoaderService
  ) {}
  ngOnInit() {
    var info = localStorage.getItem("user");
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo["objectId"];
    this.userobjectId = objectId;
    this.getAllRooms(objectId);
    this.getAlldevicesInfo(objectId);
  }
  /* Gett All Rooms */

  public getAllRooms(id) {
    this.appLoaderService.open();
    this.siteServices.getRooms(id).subscribe(data => {
      this.userRooms = data["results"];
      console.log("userRooms", this.userRooms);
      this.appLoaderService.close();
    });
  }
  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.appLoaderService.open();
    this.associatedObjectId =
      tabChangeEvent.tab["_viewContainerRef"]["_data"]["renderElement"]["id"];
      console.log("this.associatedObjectId",this.associatedObjectId);
      if (this.associatedObjectId){
        this.siteServices.associatedRoomDevices(this.associatedObjectId)
          .subscribe(data => {
            this.asoociatedDevicesRoom = data["results"];
            console.log(this.asoociatedDevicesRoom);
            this.appLoaderService.close();
          });
      } else {
        this.getAlldevicesInfo(this.userobjectId);
        this.appLoaderService.close();
      }
  };
  /* Getting all devices  */

  public getAlldevicesInfo(id) {
    this.siteServices.getAllDevices(id).subscribe(results => {
      this.getallDevices = results["results"];
    });
  }
  public Devicetoggle(event: MatSlideToggleChange, deviceObject, mac) {
    this.client = mqttt.connect(environment.mqttClient);
    let deviceObj;
    if (deviceObject["device"]) {
      deviceObj = deviceObject["device"];
    } else {
      deviceObj = deviceObject;
    }
    console.log(deviceObject);
    var macAddress = deviceObj["macAddress"];
    var deviceTypeValue = deviceObj["primaryDeviceType"]["typeValue"];
    this.smartBlindState = deviceObj["deviceSetting"]["smartBlindsStateType"];
    this.useDefaultState = deviceObj["state"];
    let payload;
    switch (deviceTypeValue) {
      case "SBS":
        if (this.smartBlindState["typeValue"] === "off") {
          payload = {
            state:
              ((this.smartBlindState["objectId"] = "8Jt9nNwoet"),
              (this.smartBlindState["typeValue"] = "on")),
            appVersion: "1.1",
            cmd: "action",
            lastActionPlatform: "Dashboard",
            lastActionTime: "1562650252286",
            mac: macAddress,
            user: "RASA",
            mobileId: "deed9ec7-bd50-4b6a-bb9c-9b4fef0bf9f1"
          };
          // this.client = mqttt.connect('ws://server.mux.life:9001');
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
                // this.siteServices.associatedRoomDevices(this.associatedObjectId).subscribe(data => {
                //   this.asoociatedDevicesRoom = data['results'];
                //   console.log(this.asoociatedDevicesRoom);
                //   this.appLoaderService.close();
                // })
              }, 1000);
              this.client.end();
            });
          });
          this.client.on("message", function(topic, message) {
            console.log(message.toString());
          });
        } else {
          payload = {
            state:
              ((this.smartBlindState["objectId"] = "MBp3Bv68zN"),
              (this.smartBlindState["typeValue"] = "off")),
            appVersion: "1.1",
            cmd: "action",
            lastActionPlatform: "android",
            lastActionTime: "1562650252286",
            mac: macAddress,
            user: "RASA",
            mobileId: "deed9ec7-bd50-4b6a-bb9c-9b4fef0bf9f1"
          };
          // this.client = mqttt.connect('ws://server.mux.life:9001');
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
              }, 1000);
              this.client.end();
            });
          });
          this.client.on("message", function(topic, message) {
            // message is Buffer
            console.log(message.toString());
          });
        }
        break;

      case "sol":
        if (event.checked === true && deviceObject["status"] === true) {
          payload = {
            mac: macAddress,
            state: this.useDefaultState = "on",
            user: "Rasa",
            cmd: "action",
            lastActionPlatform: "dashboard",
            lastActionTime: 1539604000,
            mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
            appVersion: "2.4"
          };
          this.deiveStatusFlag = true;
          this.client.on("connect", () => {
            this.client.subscribe(`saturn/desired/${macAddress}`, err => {
              this.appLoaderService.open();
              if (err) throw err;
              this.client.publish(
                `saturn/desired/${macAddress}`,
                JSON.stringify(payload)
              );
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
                    this.deiveStatusFlag = false;
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
            mac: macAddress,
            state: this.useDefaultState = "off",
            user: "Rasa",
            cmd: "action",
            lastActionPlatform: "dashboard",
            lastActionTime: 1539604000,
            mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
            appVersion: "2.4"
          };
          // this.client = mqttt.connect('ws://server.mux.life:9001');
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
              }, 5000);
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
                      duration: 0,
                      data: "Device status pending"
                    }
                  );
                  // setTimeout(() => {
                  if (checkStatus["cmd"] != "actionAck") {
                    this.appLoaderService.close();
                    this.deiveStatusFlag = false;
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
        break;

      case "SWS":
        if (event.checked === true) {
          payload = {
            mac: macAddress,
            state: this.useDefaultState = "on",
            user: "Rasa",
            cmd: "action",
            lastActionPlatform: "dashboard",
            lastActionTime: 1539604000,
            mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
            appVersion: "2.4"
          };
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
              }, 5000);
              // this.client.end();
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
                    this.deiveStatusFlag = false;
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
            mac: macAddress,
            state: this.useDefaultState = "off",
            user: "Rasa",
            cmd: "action",
            lastActionPlatform: "dashboard",
            lastActionTime: 1539604000,
            mobileId: "939EA8FD-CF0D-4830-9673-B3DABFC6830C",
            appVersion: "2.4"
          };
          // this.client = mqttt.connect('ws://server.mux.life:9001');
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
              }, 5000);
              this.client.subscribe(
                `saturn/reported/${macAddress}`,
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
                    this.deiveStatusFlag = false;
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
        break;

      default:
        console.log("no device");
    }
  }
  public settingOptions() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  public backButton() {
    this._location.back();
  }
  public switchboardStatus(assocDevices): void {
    const dialogRef = this.dialog.open(SwitchboardSocketComponent, {
      width: "250px",
      data: assocDevices
    });
    dialogRef.afterClosed().subscribe(result => {
      this.siteServices
        .associatedRoomDevices(this.associatedObjectId)
        .subscribe(data => {
          this.asoociatedDevicesRoom = data["results"];
        });
    });
  }
  public dimmerStateType(assocDevices): void {
    const dialogRef = this.dialog.open(DimmerSocketComponent, {
      width: "0 auto",
      height: "0 auto",
      data: assocDevices
    });
    dialogRef.afterClosed().subscribe(result => {
      this.siteServices
        .associatedRoomDevices(this.associatedObjectId)
        .subscribe(data => {
          this.asoociatedDevicesRoom = data["results"];
        });
    });

    // var dimmerStateObject = assocDevices['device']['deviceSetting']['dimmerStateType']['objectId'];
    // this.siteServices.dimmerStateTypeDevices(dimmerStateObject).subscribe(data => {
    // })
  }
  public smartRemoteOverview(assocDevices) {
    console.log(assocDevices);
    const dialogRef = this.dialog.open(SmartRemoteOverviewComponent, {
      width: "350px",
      data: assocDevices
    });
    dialogRef.afterClosed().subscribe(result => {
      this.siteServices
        .associatedRoomDevices(this.associatedObjectId)
        .subscribe(data => {
          this.asoociatedDevicesRoom = data["results"];
        });
    });
  }
  public smartBlindSateType(assocDevices) {
    console.log("assocDevices", assocDevices);
    const dialogRef = this.dialog.open(SmartBlindComponent, {
      width: "0 auto",
      data: assocDevices
    });
    dialogRef.afterClosed().subscribe(result => {
      this.siteServices
        .associatedRoomDevices(this.associatedObjectId)
        .subscribe(data => {
          this.asoociatedDevicesRoom = data["results"];
        });
    });
  }
  public smartLightOption(assocDevices) {
    const dialogRef = this.dialog.open(SmartLightDeviceComponent, {
      width: "350px",
      data: assocDevices
    });
    dialogRef.afterClosed().subscribe(result => {
      this.siteServices
        .associatedRoomDevices(this.associatedObjectId)
        .subscribe(data => {
          this.asoociatedDevicesRoom = data["results"];
        });
    });
  }
  ngOnDestroy(): void {
    // this.client.end();
  }
}
