import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {ProfileService } from '../profile.service';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {
  srcResult : any;
  public imagePath;
  imgURL: any;
  public message: string;
  public addProfileForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddProfileComponent>,
    private formBuilder: FormBuilder,
    private profileService : ProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.initializeForm();
  }

  public initializeForm(){
    this.addProfileForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname : ['',Validators.required],
      phoneNo: ['', Validators.required],
      profileImage : ['' , Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  public onProfileSubmit(){
    console.log(this.addProfileForm.value);
    console.log(this.imgURL);
    var addProfileValues = this.addProfileForm.value;
    var user  = localStorage.getItem('user');
    var userObject = JSON.parse(user);
    var userTypeId = userObject['objectId'];

    var addProfilePayload = {
      adminUserId : userTypeId,
      userParseObject : {
        firstName : addProfileValues['fname'],
        lastName :  addProfileValues['lname'],
        phoneNumber : addProfileValues['phoneNo'],
        userObject : addProfileValues['userObject']
      }
    }
    var data = JSON.stringify(addProfilePayload);
    this.profileService.editProfileFunc(data).subscribe(data => {
      if(data){
        alert('success');
      }
    }, (err) => {
      console.log('something went wrong' , err);
    })
  }
}
