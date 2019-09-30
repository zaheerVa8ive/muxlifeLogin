import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddProfileComponent} from '../add-profile/add-profile.component';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userInfo : any;
  constructor(private _location: Location , public dialog: MatDialog){}

  ngOnInit() {
    this.userProfileInfo();
  }

  public userProfileInfo(){
    var x = localStorage.getItem('user');
    var y = JSON.parse(x);
    this.userInfo = y;
  }
  public backBtn(){
    this._location.back();
  }

  addProfile(): void {
    const dialogRef = this.dialog.open(AddProfileComponent , {
      width: '300px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  

}
