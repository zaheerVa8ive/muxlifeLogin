import { Component, OnInit , Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material";
@Component({
  selector: 'app-wallplugdisplay-scene-automation',
  templateUrl: './wallplugdisplay-scene-automation.component.html',
  styleUrls: ['./wallplugdisplay-scene-automation.component.scss']
})
export class WallplugdisplaySceneAutomationComponent implements OnInit {
  smartSocketPlugDeviceObject: any;
  deviceState : any;
  constructor(
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<WallplugdisplaySceneAutomationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log("this.data", this.data);

    if (this.data["device"]) {
      this.smartSocketPlugDeviceObject = this.data["device"];
    } else {
      this.smartSocketPlugDeviceObject = this.data;
    }
  }

  public onNoClick(): void {
    if (this.data.state) {
      this.dialogRef.close(this.deviceState);
    } else {
      this.dialogRef.close();
    }
  }

  socketPlugdeviceState(DeviceState) {
    this.deviceState = DeviceState;
    console.log("DeviceState", DeviceState);
  }

}
