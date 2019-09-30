import { Component, OnInit, OnChanges, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { SitesService } from "../../sites.service";
import * as mqttt from "mqtt";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-switchboard-socket",
  templateUrl: "./switchboard-socket.component.html",
  styleUrls: ["./switchboard-socket.component.scss"]
})
export class SwitchboardSocketComponent implements OnInit, OnChanges {
  smartSocketObject: any;
  client: any;
  socketStates = {
    socket1: false,
    socket2: false,
    socket3: false,
    socket: true
  };
  state: boolean;
  constructor(
    private siteService: SitesService,
    public appLoaderService: AppLoaderService,
    public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SwitchboardSocketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log("this.data", this.data);
    if (this.data["state"]) {
      this.state = true;
    }
    if (this.data["device"]) {
      this.smartSocketObject = this.data["device"];
    } else {
      this.smartSocketObject = this.data;
    }
  }
  ngOnChanges() {
    // this.smartSocketObject = this.data;
  }

  sumbitFunc(): void {
    this.ngOnInit();
    if (this.data["state"]) {
      this.dialogRef.close(this.socketStates);
    } else {
      this.dialogRef.close();
    }
  }

  buttonTriger(ev, buttonId) {
    console.log(this.data);
    var smartsocket1Status = this.smartSocketObject["deviceSetting"][
      "switch1State"
    ];
    var smartsocket2Status = this.smartSocketObject["deviceSetting"][
      "switch2State"
    ];
    var smartsocket3Status = this.smartSocketObject["deviceSetting"][
      "switch3State"
    ];
    var macaddress = this.smartSocketObject["macAddress"];
    var payload;
    switch (buttonId) {
      case 1:
        if (ev.checked === true) {
          payload = {
            cmd: "action",
            mac: macaddress,
            state: "on",
            status: "online",
            lastActionPlatform: "device",
            controlNumber: buttonId,
            deviceType: "SB3",
            lastActionTime: ""
          };
          ev.checked = false;
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
              }, 1000);
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
        } else if (smartsocket1Status === true || ev.checked === false) {
          payload = {
            cmd: "action",
            mac: macaddress,
            state: "off",
            status: "online",
            lastActionPlatform: "device",
            controlNumber: buttonId,
            deviceType: "SB3",
            lastActionTime: ""
          };
          ev.checked = true;
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
              }, 1000);
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
          console.log("err");
        }
        break;

      case 2:
        if (ev.checked === true) {
          payload = {
            cmd: "action",
            mac: macaddress,
            state: "on",
            status: "online",
            lastActionPlatform: "device",
            controlNumber: buttonId,
            deviceType: "SB3",
            lastActionTime: ""
          };
          ev.checked = false;
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
              }, 1000);
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
        } else if (smartsocket2Status === true || ev.checked === false) {
          payload = {
            cmd: "action",
            mac: macaddress,
            state: "off",
            status: "online",
            lastActionPlatform: "device",
            controlNumber: buttonId,
            deviceType: "SB3",
            lastActionTime: ""
          };
          ev.checked = true;
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
          console.log("err");
        }
        break;

      default:
        if (ev.checked === true) {
          payload = {
            cmd: "action",
            mac: macaddress,
            state: "on",
            status: "online",
            lastActionPlatform: "device",
            controlNumber: buttonId,
            deviceType: "SB3",
            lastActionTime: ""
          };
          ev.checked = false;
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
        } else if (smartsocket3Status === true || ev.checked === false) {
          payload = {
            cmd: "action",
            mac: macaddress,
            state: "off",
            status: "online",
            lastActionPlatform: "device",
            controlNumber: buttonId,
            deviceType: "SB3",
            lastActionTime: ""
          };
          ev.checked = true;
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
          console.log("err");
        }
        break;
    }
  }

  buttonTrigerState(ev, buttonId) {
    console.log("ev , buttonId", ev["checked"], buttonId);
    this.socketStates["socket" + buttonId] = ev["checked"];
  }
}
