import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import {SessionService } from '../session.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  userEmail;
  formErrors;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  constructor( private sessionService : SessionService , private router : Router) { }

  ngOnInit() {
  }
  
  submitEmail() {
    const signinData = this.userEmail;
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
    this.sessionService.forgotPasswordApi(signinData).subscribe( data => {
      if(data){
        this.formErrors = `Password reset successfully!`;
        setTimeout(() => {
          this.router.navigate(['/sessions/signin']);
        }, 2000);
      }
    }, (err) => {
      this.formErrors = `No such account found with email, "${this.userEmail}"`;
      this.submitButton.disabled = false;
    });
  }
}
