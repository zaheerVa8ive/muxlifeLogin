import { Component,  EventEmitter, OnInit ,  Output , Input} from '@angular/core';
import { SitesService } from '../../sites.service';
import { MatTabChangeEvent } from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SmartBlindComponent } from '../smart-blind/smart-blind.component';
import { SwitchboardSocketComponent } from '../switchboard-socket/switchboard-socket.component';
import { DimmerSocketComponent } from '../dimmer-socket/dimmer-socket.component';
import { SmartLightDeviceComponent } from '../smart-light-device/smart-light-device.component';
import { DeviceStatusCheckFormComponent } from '../device-status-check-form/device-status-check-form.component';
import { WallplugdisplaySceneAutomationComponent } from '../wallplugdisplay-scene-automation/wallplugdisplay-scene-automation.component';
import { SmartRemoteOverviewComponent } from '../smart-remote-overview/smart-remote-overview.component';

@Component({
  selector: 'app-add-scenes',
  templateUrl: './add-scenes.component.html',
  styleUrls: ['./add-scenes.component.scss']
})
export class AddScenesComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private  _snackBar: MatSnackBar,
    private siteServices : SitesService) {}

    userRooms : [];
    @Output() created =  new EventEmitter<boolean>();
    @Input() sceneEditId: any;
    getallDevices : any[];
    sceneName:any;
    roomsInfo : any;
    objectId : any;
    associatedObjectId:any;
    selectedDevicesIds:any [];
    associatedDevicesRoom:any;
    checkedDevices:any [] = [];
    roomIndex:any;
    editDevices : any;



  ngOnInit() {
    var self = this;
    var info = localStorage.getItem('user');
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo['objectId'];
    self.objectId = objectId;
    self.getAllRooms(objectId);
    self.roomIndex = 0;
    console.log("sceneEditId",self.sceneEditId);
    if (self.sceneEditId){
      console.log("sceneEditId",self.sceneEditId);
      let sceneId = self.sceneEditId['objectId'];
      self.sceneName = self.sceneEditId['name'];
      self.siteServices.associatedSceneDevicesbyId(sceneId).subscribe(data => {
        let selectedDevics = data['results'];
        self.editDevices = selectedDevics; 
        self.siteServices.getAllDevices(objectId).subscribe(results => {
          let getallDevices = results['results'];
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
        });
      });
    } else {
      self.sceneName = "";
      self.checkedDevices = [];
      self.getAlldevicesInfo(objectId);
    }
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

   /* Gett All Rooms */ 
   public getAllRooms(id){
    this.siteServices.getRooms(id).subscribe(data => {
    this.userRooms = data['results'];
    })
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

  public smartRemoteOverview(assocDev){
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

  public createScene(){
    let self = this;
    if (!self.sceneName){
      self._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
        data: 'Please Enter Scene Name',
        duration:2000
      });
      return;
    }
    if (!self.checkedDevices.length){
      self._snackBar.openFromComponent(DeviceStatusCheckFormComponent, {
        data: 'Please Select Atleast One Device',
        duration:2000
      });
      return;
    }

    if (self.sceneEditId){
      let updateData = {
        'name': self.sceneName
      };
      let sceneId = self.sceneEditId['objectId'];
      this.siteServices.sceneUpdate(updateData,sceneId).subscribe(results => {
        self.deleteObj(self.editDevices);
          let checkedDevices = this.checkedDevices;
          this.sceneName = "";
          for (var j =0 ; j < checkedDevices.length ; j++){
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
            } else if (checkedDevices[j]['dimmerStateType']){
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
              console.log("110 , deviceSettingObject",deviceSettingObject);
            let deviceSetting = {
              'className': 'DeviceSetting',
              '__type': 'Pointer',
              'objectId': deviceSettingObject['objectId']
            };
              let scene = {
              'className': 'Scene',
              '__type': 'Pointer',
              'objectId': sceneId
            };
            let AssociatedSceneDevices = {
              'scene':scene,
              'deviceSetting':deviceSetting,
              'device':device
            };
              this.siteServices.AssociatedSceneDevices(AssociatedSceneDevices).subscribe(associatedSDevices => {
                console.log("110 , associatedSDevices",associatedSDevices);
                console.log(" chkd", chkd)
                if (chkd['remoteState']){
                  let smartDeviceSetting = chkd['remoteState']['payload'];
                  this.siteServices.DeviceSettingObject(smartDeviceSetting).subscribe(smartDeviceSetting => {
                    let deviceSetting = {
                      'className': 'DeviceSetting',
                      '__type': 'Pointer',
                      'objectId': smartDeviceSetting['objectId']
                    };
                    let AssocSceneSmartRemoteDevices = {
                      'deviceSetting':deviceSetting,
                      'remoteDevice':device,
                      'associatedRemoteDevice': chkd['remoteState']['associatedRemoteDevice'],
                      'scene':scene
                    };
                    console.log("AssocSceneSmartRemoteDevices",AssocSceneSmartRemoteDevices);
                    this.siteServices.AssocSceneSmartRemoteDevices(AssocSceneSmartRemoteDevices).subscribe(AssocSceneSmartRemoteResult => {
                      console.log("AssocSceneSmartRemoteResult",AssocSceneSmartRemoteResult)
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
          self.created.emit(true);
        });
    } else {
      let user = {
        '__type':'Pointer',
        'className':'_User',
        'objectId': this.objectId
      }
      let postData = {
        'sceneStatus':false,
        'notificationState': false,
        'name': this.sceneName,
        'user': user
      };
      this.siteServices.sceneCreation(postData).subscribe(results => {
        let checkedDevices = this.checkedDevices;
        this.sceneName = "";
        for (var j =0 ; j < checkedDevices.length ; j++){
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
          } else if (checkedDevices[j]['dimmerStateType']){
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
            console.log("110 , deviceSettingObject",deviceSettingObject);
          let deviceSetting = {
            'className': 'DeviceSetting',
            '__type': 'Pointer',
            'objectId': deviceSettingObject['objectId']
          };
            let scene = {
            'className': 'Scene',
            '__type': 'Pointer',
            'objectId': results['objectId']
          };
          let AssociatedSceneDevices = {
            'scene':scene,
            'deviceSetting':deviceSetting,
            'device':device
          };
            this.siteServices.AssociatedSceneDevices(AssociatedSceneDevices).subscribe(associatedSDevices => {
              console.log("110 , associatedSDevices",associatedSDevices);
              console.log(" chkd", chkd)
              if (chkd['remoteState']){
                let smartDeviceSetting = chkd['remoteState']['payload'];
                this.siteServices.DeviceSettingObject(smartDeviceSetting).subscribe(smartDeviceSetting => {
                  let deviceSetting = {
                    'className': 'DeviceSetting',
                    '__type': 'Pointer',
                    'objectId': smartDeviceSetting['objectId']
                  };
                  let AssocSceneSmartRemoteDevices = {
                    'deviceSetting':deviceSetting,
                    'remoteDevice':device,
                    'associatedRemoteDevice': chkd['remoteState']['associatedRemoteDevice'],
                    'scene':scene
                  };
                  console.log("AssocSceneSmartRemoteDevices",AssocSceneSmartRemoteDevices);
                  this.siteServices.AssocSceneSmartRemoteDevices(AssocSceneSmartRemoteDevices).subscribe(AssocSceneSmartRemoteResult => {
                    console.log("AssocSceneSmartRemoteResult",AssocSceneSmartRemoteResult)
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
        self.created.emit(true);
      });
    }
  }

  deleteObj(deleteobj){
    console.log("566 , deleteobj",deleteobj);
    let response=[];
    for (var j = 0 ; j < deleteobj.length ; j++){
      this.siteServices.deleteAssociatedSceneDevices(deleteobj[j]['objectId']).subscribe(deleteResult => {
        console.log("deleteResult",deleteResult);
        response.push(deleteResult);
      });
    }
    console.log("response",response);
    // cb(null,response);
  }

  public onClickExpandRx(e , data){
    if (e){
      this.checkedDevices.push(data);
    } else {
      var filtered = this.checkedDevices.filter(function(obj) {
        return (!(obj['objectId'] == data['objectId']));
      });
      this.checkedDevices = filtered;
    }
    console.log("this.checkedDevices",this.checkedDevices);
  }

  public getAlldevicesInfo(id){
    this.siteServices.getAllDevices(id).subscribe(results => {
      this.getallDevices = results['results'];
    })
  }

}
