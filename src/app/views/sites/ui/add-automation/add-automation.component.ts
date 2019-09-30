import { Component, EventEmitter, OnInit ,  Output , Input } from "@angular/core";
import { Location } from "@angular/common";
import { SitesService } from "../../sites.service";
import * as moment from 'moment';
import 'moment-timezone';
import { MatTabChangeEvent } from "@angular/material";
import {MatSnackBar} from '@angular/material';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SmartBlindComponent } from "../smart-blind/smart-blind.component";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { SmartLightDeviceComponent } from "../smart-light-device/smart-light-device.component";
import { DimmerSocketComponent } from "../dimmer-socket/dimmer-socket.component";
import { SwitchboardSocketComponent } from "../switchboard-socket/switchboard-socket.component";
import { DeviceStatusCheckFormComponent } from "../device-status-check-form/device-status-check-form.component";
import { WallplugdisplaySceneAutomationComponent } from "../wallplugdisplay-scene-automation/wallplugdisplay-scene-automation.component";
import { SmartRemoteOverviewComponent } from "../smart-remote-overview/smart-remote-overview.component";

@Component({
  selector: "app-add-automation",
  templateUrl: "./add-automation.component.html",
  styleUrls: ["./add-automation.component.scss"]
})
export class AddAutomationComponent implements OnInit {
  utcDateTime: any;
  @Output() created =  new EventEmitter<boolean>();
  @Input() automationId: any;
  conditions = [{ value: "schedule", viewValue: "schedule" }];
  userRooms: [];
  getallDevices: any[];
  sceneName: any;
  automationName:any;
  selectedCondition:any;
  selectedScenes:any;
  scheduleTime:any;
  scheduleDays:any;
  roomsInfo: any;
  objectId: any;
  associatedObjectId: any;
  selectedDevicesIds: any[];
  associatedDevicesRoom: any;
  checkedDevices: any[] = [];
  getAllscenes: [];
  editDevices : any;
  now :any;
  weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  roomIndex:any;
  public AddScenesForm: FormGroup;

  constructor(
    private _location: Location,
    private  _snackBar: MatSnackBar,
    private siteServices: SitesService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    let self = this;
    var info = localStorage.getItem("user");
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo["objectId"];
    this.objectId = objectId;
    this.roomIndex = 0;
    this.getAllRooms(objectId);
    this.getAllScenesInfo(objectId);
    if (self.automationId){
      console.log("edit option for automation");
      let autoId = self.automationId['objectId'];
      self.automationName = self.automationId['name'];
      console.log("automationId",self.automationId);
      self.siteServices.userAssociatedAutomationDevices(autoId).subscribe(data => {
        let selectedDevics = data['results'];
        self.editDevices = selectedDevics;
        console.log("self.editDevices",self.editDevices);
        self.selectedCondition = "schedule"; 
        self.siteServices.getAllDevices(objectId).subscribe(results => {
          if (self.automationId['selectedScene']){
            let getAllscenes = self.getAllscenes;
            for (var d = 0 ; d < getAllscenes.length; d++ ){
              if (self.automationId['selectedScene']['objectId'] == getAllscenes[d]['objectId']){
                self.selectedScenes = self.automationId['selectedScene']['objectId'];
              }
            }
          }
          let conditionVal = self.automationId['conditionValue'].split(',');
          let timeZone = moment.tz.guess();
          let hm = conditionVal[conditionVal.length - 1];
          let getallDevices = results['results'];
          self.scheduleDays = conditionVal.slice(0 , conditionVal.length - 1);
          var timeNY = moment(new Date()).tz('America/New_York');
          var dateNY = timeNY['_d'];
          dateNY.setHours(parseInt(hm.slice(0,2)) + 4);
          dateNY.setMinutes(parseInt(hm.slice(2,4)));
          this.scheduleTime = moment(dateNY).tz(timeZone)['_d'];
          var modified = getallDevices.map(function(obj) {
            for (var j = 0; j < selectedDevics.length; j++ ){
                if (selectedDevics[j]['device']['objectId'] == obj['objectId'] ){
                  self.checkedDevices.push(obj);
                  obj['checked'] = true;
                  obj['deviceSetting'] = selectedDevics[j]['deviceSetting'];
              }
            }
            return obj;
          });
          self.getallDevices = modified;
          console.log("106 , self.getallDevices",self.getallDevices);
        });
      });
    } else {
      console.log("new option for automation");
      self.automationName = "";
      self.selectedScenes = "";
      self.scheduleDays = "";
      self.scheduleTime = "";
      self.selectedCondition = "";
      self.checkedDevices = [];
      this.getAlldevicesInfo(objectId);
    }
  }

  smartRemoteOverview(assocDev){
    console.log("177 , assocDev",assocDev);
    let assocDevice = {};
    if (assocDev['device']){
      assocDevice = assocDev['device'];
    } else {
      assocDevice = assocDev;
    }
    let data = {
      'state':true,
      'device':assocDevice
    };

    const dialogRef = this.dialog.open(SmartRemoteOverviewComponent, {
      width: "350px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      let checkedDevices = this.checkedDevices;
      console.log("194 addscenes , result",result);
      for (var i = 0 ; i < checkedDevices.length ; i++){
        console.log("checkedDevices[i]['objectId']",checkedDevices[i]['objectId']);
        console.log("assocDev['objectId']",assocDevice['objectId']);
        if (checkedDevices[i]['objectId'] == assocDevice['objectId']){
         checkedDevices[i]['remoteState'] = result;
        }
      }
    });
  }
  public getAllScenesInfo(id) {
    this.siteServices.userAssociatedScenes(id).subscribe(data => {
      this.getAllscenes = data["results"];
    });
  }
  public addAutomation() {
    let self = this;
    if (!this.automationName){
      this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
        data: 'Please Enter Automation Name',
        duration:2000
      });
      return;
    }
    if (!this.scheduleTime){
      this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
        data: 'Please Enter Schedule Time',
        duration:2000
      });
      return;
    }
    if (!this.scheduleDays.length){
      this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
        data: 'Please Select Atleast One Day',
        duration:2000
      });
      return;
    }
    if (!this.selectedScenes &&  self.checkedDevices.length == 0){
      this._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
        data: 'Please Select A Scene or A Device',
        duration:2000
      });
      return;
    }
    var schTime = moment(this.scheduleTime).tz('America/New_York');
    var finalSchTime = schTime['_d'];
    var hours = (finalSchTime.getHours() -5 ).toString();
    var minutes = finalSchTime.getMinutes().toString();
    let fHours = "",fMinutes="";
    if (hours.length == 1){
      fHours = `0${hours}`;
    } else {
      fHours = `${hours}`;
    }
    if (minutes.length == 1){
      fMinutes = `0${minutes}`;
    } else {
      fMinutes = `${minutes}`;
    }
    var scheduleTime = `${fHours}${fMinutes}`;
    var scheduleDays = this.scheduleDays;
    scheduleDays.push(scheduleTime);
    var schedule = scheduleDays.toString();
    const automationName = this.automationName;
    if (self.automationId){
        const payLoad = {
          name: automationName,
          conditionValue: schedule
        };
      if (this.selectedScenes){
        payLoad['selectedScene'] =  {
          __type: "Pointer",
          className: "Scene",
          objectId: `${this.selectedScenes}`
        }
      }
      let autoId = self.automationId['objectId'];
      this.siteServices.AutomationUpdate(payLoad , autoId).subscribe(results => {
        console.log("automation created ", results);
        self.deleteObj(self.editDevices);
        self.automationName = "";
        self.selectedScenes = "";
        self.scheduleDays = "";
        self.scheduleTime = "";
        self.selectedCondition = "";
        let checkedDevices = self.checkedDevices;
        console.log("checkedDevices in edit",checkedDevices);
        for (var j = 0 ; j < checkedDevices.length ; j++){
          let chkd = checkedDevices[j];
          let device = {
            'className': 'Device',
            '__type': 'Pointer',
            'objectId': checkedDevices[j].objectId
          };
          let deviceSettingObject = {};
          if ( checkedDevices[j]['deviceState'] && checkedDevices[j]['deviceState']['socket']){
              deviceSettingObject["deviceState"]   = false,
              deviceSettingObject["switch3State"]  = checkedDevices[j]['deviceState']['socket3'],
              deviceSettingObject["switch2State"]  = checkedDevices[j]['deviceState']['socket2'],
              deviceSettingObject["switch1State"]  = checkedDevices[j]['deviceState']['socket1'],
              deviceSettingObject["dimPercentage"] = checkedDevices[j].deviceSetting.dimPercentage
          } else if (checkedDevices[j]['primaryDeviceType']['typeKey'] == 'KEY_SMART_REMOTE'){
              deviceSettingObject["deviceState"]      = checkedDevices[j].deviceSetting.deviceState,
              deviceSettingObject["switch3State"]     = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]     = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]     = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"]    = checkedDevices[j].deviceSetting.dimPercentage
        }  else if (checkedDevices[j]['dimmerStateType']){
              deviceSettingObject["deviceState"]      = checkedDevices[j].deviceSetting.deviceState,
              deviceSettingObject["switch3State"]     = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]     = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]     = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"]    = checkedDevices[j].deviceSetting.dimPercentage,
              deviceSettingObject["dimmerStateType"]  = checkedDevices[j].dimmerStateType
          } else if (checkedDevices[j]['rgbLightColors']){
              deviceSettingObject["rgbwColorCodes"]   = checkedDevices[j].rgbLightColors,
              deviceSettingObject["deviceState"]      = false,
              deviceSettingObject["switch3State"]     = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]     = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]     = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"]    = checkedDevices[j].deviceSetting.dimPercentage
          } else {
              deviceSettingObject["deviceState"]   = checkedDevices[j].deviceState,
              deviceSettingObject["switch3State"]  = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]  = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]  = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"] = checkedDevices[j].deviceSetting.dimPercentage
          }
          this.siteServices.DeviceSettingObject(deviceSettingObject).subscribe(deviceSettingObject => {
            console.log("143 , deviceSettingObject",deviceSettingObject);
          let deviceSetting = {
            'className': 'DeviceSetting',
            '__type': 'Pointer',
            'objectId': deviceSettingObject['objectId']
          };
            let automation = {
            'className': 'Automation',
            '__type': 'Pointer',
            'objectId': autoId
          };
          let AssociatedAutomationDevices = {
            'automation':automation,
            'deviceSetting':deviceSetting,
            'device':device
          };
          console.log("AssociatedAutomationDevices",AssociatedAutomationDevices);
            this.siteServices.AssociatedAutomationDevices(AssociatedAutomationDevices).subscribe(associatedSDevices => {
              console.log("161 , associatedSDevices",associatedSDevices);
              console.log(" chkd", chkd)
              if (chkd['remoteState']){
                let smartDeviceSetting = chkd['remoteState']['payload'];
                this.siteServices.DeviceSettingObject(smartDeviceSetting).subscribe(smartDeviceSetting => {
                  let deviceSetting = {
                    'className': 'DeviceSetting',
                    '__type': 'Pointer',
                    'objectId': smartDeviceSetting['objectId']
                  };
                  let AssocAutoSmartRemoteDevices = {
                    'deviceSetting':deviceSetting,
                    'remoteDevice':device,
                    'associatedRemoteDevice': chkd['remoteState']['associatedRemoteDevice'],
                    'automation':automation
                  };
                  console.log("AssocAutoSmartRemoteDevices",AssocAutoSmartRemoteDevices);
                  this.siteServices.AssocAutomationSmartRemoteDevices(AssocAutoSmartRemoteDevices).subscribe(AssocAutoSmartRemoteDevicesResult => {
                    console.log("AssocAutoSmartRemoteDevicesResult",AssocAutoSmartRemoteDevicesResult)
                  })
                })
              }
            });
          });
        }
        if (self.roomIndex != 0 ){
          var modified = self.associatedDevicesRoom.map(function(obj) {
            let checkedDevices =   self.checkedDevices;
            for (var j = 0; j < checkedDevices.length; j++ ){
                if (checkedDevices[j]['objectId'] == obj['device']['objectId'] ){
                  obj['device']['checked'] = false;
              } else {
                if (checkedDevices[j]['objectId'] == obj['objectId'] ){
                  obj['checked'] = false;
                }
              }
            }
            return obj;
          });
          self.associatedDevicesRoom = modified;
        } else {
          var modifiedDevices =[];
          modifiedDevices = self.getallDevices.map(function(obj) {
            let checkedDevices =   self.checkedDevices;
            for (var j = 0; j < checkedDevices.length; j++ ){
                if (checkedDevices[j]['objectId'] == obj['objectId'] ){
                  obj['checked'] = false;
                }
            }
            return obj;
          });
          self.getallDevices = modifiedDevices;
        }
        console.log("edit finished");
        self.automationId = null;
        self.created.emit(true);
      });
    } else {
      const payLoad = {
        notificationState: true,
        name: automationName,
        automationConditionOperator: {
          __type: "Pointer",
          className: "AutomationConditionOperatorType",
          objectId: "BNS1SvFHmf"
        },
        automationAction: {
          __type: "Pointer",
          className: "AutomationActionType",
          objectId: "olKJBYxmyi"
        },
        user: {
          __type: "Pointer",
          className: "_User",
          objectId: `${self.objectId}`
        },
        conditionValue: schedule
      };
      if (self.selectedScenes){
        payLoad['selectedScene'] =  {
          __type: "Pointer",
          className: "Scene",
          objectId: `${self.selectedScenes}`
        }
      }
      this.siteServices.AutomationCreation(payLoad).subscribe(results => {
        console.log("automation created ", results);
        self.automationName = "";
        self.selectedScenes = "";
        self.scheduleDays = "";
        self.scheduleTime = "";
        self.selectedCondition = "";
        let checkedDevices = this.checkedDevices;
        console.log("checkedDevices in new",checkedDevices);
        for (var j = 0 ; j < checkedDevices.length ; j++){
          let chkd = checkedDevices[j];
          let device = {
            'className': 'Device',
            '__type': 'Pointer',
            'objectId': checkedDevices[j].objectId
          };
          let deviceSettingObject = {};
          if ( checkedDevices[j]['deviceState'] && checkedDevices[j]['deviceState']['socket']){
              deviceSettingObject["deviceState"]   = false,
              deviceSettingObject["switch3State"]  = checkedDevices[j]['deviceState']['socket3'],
              deviceSettingObject["switch2State"]  = checkedDevices[j]['deviceState']['socket2'],
              deviceSettingObject["switch1State"]  = checkedDevices[j]['deviceState']['socket1'],
              deviceSettingObject["dimPercentage"] = checkedDevices[j].deviceSetting.dimPercentage
          } else if (checkedDevices[j]['primaryDeviceType']['typeKey'] == 'KEY_SMART_REMOTE'){
              deviceSettingObject["deviceState"]      = checkedDevices[j].deviceSetting.deviceState,
              deviceSettingObject["switch3State"]     = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]     = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]     = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"]    = checkedDevices[j].deviceSetting.dimPercentage
        }  else if (checkedDevices[j]['dimmerStateType']){
              deviceSettingObject["deviceState"]      = checkedDevices[j].deviceSetting.deviceState,
              deviceSettingObject["switch3State"]     = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]     = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]     = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"]    = checkedDevices[j].deviceSetting.dimPercentage,
              deviceSettingObject["dimmerStateType"]  = checkedDevices[j].dimmerStateType
          } else if (checkedDevices[j]['rgbLightColors']){
              deviceSettingObject["rgbwColorCodes"]   = checkedDevices[j].rgbLightColors,
              deviceSettingObject["deviceState"]      = false,
              deviceSettingObject["switch3State"]     = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]     = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]     = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"]    = checkedDevices[j].deviceSetting.dimPercentage
          } else {
              deviceSettingObject["deviceState"]   = checkedDevices[j].deviceState,
              deviceSettingObject["switch3State"]  = checkedDevices[j].deviceSetting.switch3State,
              deviceSettingObject["switch2State"]  = checkedDevices[j].deviceSetting.switch2State,
              deviceSettingObject["switch1State"]  = checkedDevices[j].deviceSetting.switch1State,
              deviceSettingObject["dimPercentage"] = checkedDevices[j].deviceSetting.dimPercentage
          }
          this.siteServices.DeviceSettingObject(deviceSettingObject).subscribe(deviceSettingObject => {
            console.log("143 , deviceSettingObject",deviceSettingObject);
          let deviceSetting = {
            'className': 'DeviceSetting',
            '__type': 'Pointer',
            'objectId': deviceSettingObject['objectId']
          };
            let automation = {
            'className': 'Automation',
            '__type': 'Pointer',
            'objectId': results['objectId']
          };
          let AssociatedAutomationDevices = {
            'automation':automation,
            'deviceSetting':deviceSetting,
            'device':device
          };
          console.log("AssociatedAutomationDevices",AssociatedAutomationDevices);
            this.siteServices.AssociatedAutomationDevices(AssociatedAutomationDevices).subscribe(associatedSDevices => {
              console.log("161 , associatedSDevices",associatedSDevices);
              console.log(" chkd", chkd)
              if (chkd['remoteState']){
                let smartDeviceSetting = chkd['remoteState']['payload'];
                this.siteServices.DeviceSettingObject(smartDeviceSetting).subscribe(smartDeviceSetting => {
                  let deviceSetting = {
                    'className': 'DeviceSetting',
                    '__type': 'Pointer',
                    'objectId': smartDeviceSetting['objectId']
                  };
                  let AssocAutoSmartRemoteDevices = {
                    'deviceSetting':deviceSetting,
                    'remoteDevice':device,
                    'associatedRemoteDevice': chkd['remoteState']['associatedRemoteDevice'],
                    'automation':automation
                  };
                  console.log("AssocAutoSmartRemoteDevices",AssocAutoSmartRemoteDevices);
                  this.siteServices.AssocAutomationSmartRemoteDevices(AssocAutoSmartRemoteDevices).subscribe(AssocAutoSmartRemoteDevicesResult => {
                    console.log("AssocAutoSmartRemoteDevicesResult",AssocAutoSmartRemoteDevicesResult)
                  })
                })
              }
            });
          });
        }
        if (self.roomIndex != 0 ){
          var modified = self.associatedDevicesRoom.map(function(obj) {
            let checkedDevices =   self.checkedDevices;
            for (var j = 0; j < checkedDevices.length; j++ ){
                if (checkedDevices[j]['objectId'] == obj['device']['objectId'] ){
                  obj['device']['checked'] = false;
              } else {
                if (checkedDevices[j]['objectId'] == obj['objectId'] ){
                  obj['checked'] = false;
                }
              }
            }
            return obj;
          });
          self.associatedDevicesRoom = modified;
        } else {
          var modifiedDevices =[];
          modifiedDevices = self.getallDevices.map(function(obj) {
            let checkedDevices =   self.checkedDevices;
            for (var j = 0; j < checkedDevices.length; j++ ){
                if (checkedDevices[j]['objectId'] == obj['objectId'] ){
                  obj['checked'] = false;
                }
            }
            return obj;
          });
          self.getallDevices = modifiedDevices;
        }
        console.log("new finished");
        self.created.emit(true);
      });
    }
    
  }

  deleteObj(deleteobj){
    console.log("566 , deleteobj",deleteobj);
    let response=[];
    for (var j = 0 ; j < deleteobj.length ; j++){
      this.siteServices.deleteAssociatedAutomationDevices(deleteobj[j]['objectId']).subscribe(deleteResult => {
        console.log("deleteResult",deleteResult);
        response.push(deleteResult);
      });
    }
    console.log("response",response);
    // cb(null,response);
  }

  public smartLightOption(assocDevices) {
    let assocDevice = {};
    if (assocDevices['device']){
      assocDevice = assocDevices['device'];
    } else {
      assocDevice = assocDevices;
    }
    let data = {
      'state':true,
      'device':assocDevice
    };
    const dialogRef = this.dialog.open(SmartLightDeviceComponent, {
      width: '350px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      let checkedDevices = this.checkedDevices;
     for (var i = 0 ; i < checkedDevices.length ; i++){
       if (checkedDevices[i]['objectId'] == assocDevice['objectId']){
        checkedDevices[i]['rgbLightColors'] = result;
       }
     }
    });
  }

  public deviceDisplay(assocDevices){
    let assocDevice = {};
    if (assocDevices['device']){
      assocDevice = assocDevices['device'];
    } else {
      assocDevice = assocDevices;
    }
    let data = {
      'state':true,
      'device':assocDevice
    };
    const dialogRef = this.dialog.open(WallplugdisplaySceneAutomationComponent, {
      width: '0 auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
     let checkedDevices = this.checkedDevices;
     for (var i = 0 ; i < checkedDevices.length ; i++){
       if (checkedDevices[i]['objectId'] == assocDevice['objectId']){
        checkedDevices[i]['deviceState'] = result;
       }
     }
    });
  }

  public smartBlindSateType(assocDevices){
    let assocDevice = {};
    if (assocDevices['device']){
      assocDevice = assocDevices['device'];
    } else {
      assocDevice = assocDevices;
    }
    let data = {
      'state':true,
      'device':assocDevice
    };
    const dialogRef = this.dialog.open(SmartBlindComponent, {
      width: '0 auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
     let checkedDevices = this.checkedDevices;
     for (var i = 0 ; i < checkedDevices.length ; i++){
       if (checkedDevices[i]['objectId'] == assocDevice['objectId']){
        checkedDevices[i]['deviceState'] = result;
       }
     }
    });
  }

  public dimmerStateType(assocDevices) : void {
    let assocDevice = {};
    if (assocDevices['device']){
      assocDevice = assocDevices['device'];
    } else {
      assocDevice = assocDevices;
    }
    let data = {
      'state':true,
      'device':assocDevice
    };
    const dialogRef = this.dialog.open(DimmerSocketComponent, {
      width: '0 auto',
      height : '0 auto',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result",result);
      this.siteServices.dimmerStateTypeBytypeValue(result).subscribe(data => {
        let checkedDevices = this.checkedDevices;
        let dimmerStateType = {
          'className': 'DimmerStateType',
          '__type': 'Pointer',
          'objectId': data['results'][0]['objectId']
        };
        for (var i = 0 ; i < checkedDevices.length ; i++){
          if (checkedDevices[i]['objectId'] == assocDevice['objectId']){
            checkedDevices[i]['dimmerStateType'] = dimmerStateType;
          }
        }
      });
    });
  }

  public switchboardStatus(assocDevices): void {
    let assocDevice = {};
    if (assocDevices['device']){
      assocDevice = assocDevices['device'];
    } else {
      assocDevice = assocDevices;
    }
    let data = {
      'state':true,
      'device':assocDevice
    };
    const dialogRef = this.dialog.open(SwitchboardSocketComponent, {
      width: '250px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      let checkedDevices = this.checkedDevices;
     for (var i = 0 ; i < checkedDevices.length ; i++){
       if (checkedDevices[i]['objectId'] == assocDevice['objectId']){
        checkedDevices[i]['deviceState'] = result;
       }
     }
    });
  }

  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.roomIndex = tabChangeEvent['index'];
    if (tabChangeEvent['index'] != 0){
      this.associatedObjectId = tabChangeEvent.tab['_viewContainerRef']['_data']['renderElement']['id'];
      this.siteServices.associatedRoomDevices(this.associatedObjectId).subscribe(data => {
        let associatedDevicesRoom = data['results'];
        let self = this;
        var modified = associatedDevicesRoom.map(function(obj) {
          let checkedDevices =  self.checkedDevices;
          for (var j = 0; j < checkedDevices.length; j++ ){
            if (checkedDevices[j]['objectId'] == obj['device']['objectId'] ){
              obj['device']['checked'] = true;
            }
          }
          return obj;
        });
        this.associatedDevicesRoom = modified;
      })
    } else {
      this.siteServices.getAllDevices(this.objectId).subscribe(data => {
        let getallDevices = data['results'];
        let self = this;
        var modified = getallDevices.map(function(obj) {
          let checkedDevices =  self.checkedDevices;
          for (var j = 0; j < checkedDevices.length; j++ ){
              if (checkedDevices[j]['objectId'] == obj['objectId'] ){
                obj['checked'] = true;
            }
          }
          return obj;
        });
        this.getallDevices = modified;
      })
    }
  }
  /* Gett All Rooms */

  public getAllRooms(id) {
    this.siteServices.getRooms(id).subscribe(data => {
      this.userRooms = data["results"];
      console.log("this.userRooms", this.userRooms);
    });
  }
    public onClickExpandRx(e, data) {
    if (e) {
      this.checkedDevices.push(data);
    } else {
      var filtered = this.checkedDevices.filter(function(obj) {
        return !(obj["objectId"] == data["objectId"]);
      });
      this.checkedDevices = filtered;
    }
    console.log("this.checkedDevices", this.checkedDevices);
  }

  public getAlldevicesInfo(id) {
    this.siteServices.getAllDevices(id).subscribe(results => {
      this.getallDevices = results["results"];
      console.log("this.getallDevices", this.getallDevices);
    });
  }
  backBtn() {
    this._location.back();
  }
}
