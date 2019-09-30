import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-device-status-check-form',
  templateUrl: './device-status-check-form.component.html',
  styleUrls: ['./device-status-check-form.component.scss']
})
export class DeviceStatusCheckFormComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<DeviceStatusCheckFormComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  openSnackBar(){}

}
