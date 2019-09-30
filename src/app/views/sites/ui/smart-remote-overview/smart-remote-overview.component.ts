import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SitesService} from '../../sites.service';
import {SmartRemoteDeviceComponent } from '../smart-remote-device/smart-remote-device.component';

@Component({
  selector: 'app-smart-remote-overview',
  templateUrl: './smart-remote-overview.component.html',
  styleUrls: ['./smart-remote-overview.component.scss']
})
export class SmartRemoteOverviewComponent implements OnInit {
  associateRemoteDeiveObject : any;
  deviceType : any;
  payload:any;
  selectedRemoteDeviceObject:any;
  deviceState : any = false;
  constructor(
    private siteSerivce : SitesService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SmartRemoteOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.smartRemoteOveview();
  }

  onNoClick(): void {
    if (this.data['state']){
      console.log("this.selectedRemoteDeviceObject",this.selectedRemoteDeviceObject);
      var remoteData = {
        'payload' : this.payload,
        'associatedRemoteDevice':{
          '__type':'Pointer',
          'className':'AssociatedRemoteDevices',
          'objectId': this.selectedRemoteDeviceObject['objectId']
        }
      }
      this.dialogRef.close(remoteData);
    } else {
      this.dialogRef.close();
    }
  }

  public smartRemoteOveview(){
    let deviceObjectId ;
    console.log("31 , this.data",this.data);
    if (this.data['device']){
      deviceObjectId = this.data['device']['objectId'];
    } else {
      deviceObjectId = this.data['objectId'];
    }
    console.log("36 , deviceObjectId",deviceObjectId);
    this.siteSerivce.smartRemoteDevice(deviceObjectId).subscribe(data => {
      console.log("smartRemoteDevice , data",data);
      this.associateRemoteDeiveObject = data['results'];
    })
  }
  public smartRemoteDeviceSetting(assocRemoteDeviceObject): void {
    if (this.data['state']){
      assocRemoteDeviceObject['deviceState'] = true;
      this.selectedRemoteDeviceObject = assocRemoteDeviceObject;
    }
    const dialogRef = this.dialog.open(SmartRemoteDeviceComponent, {
      width: '250px',
      height : 'auto',
      data: assocRemoteDeviceObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' , result);
      this.payload = result;
    });
  }


}
