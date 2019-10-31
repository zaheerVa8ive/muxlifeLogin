import { NotificationComponent } from './../notification/notification.component';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatProgressBar, MatButton } from "@angular/material";
import { MatSnackBar } from '@angular/material';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { SessionService } from "../session.service";
import { Router , ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  signinForm: FormGroup;
  formErrors: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private sessionService: SessionService
  ) { }
  private client_id;
  private redirect_uri;
  private state;
  private response_type;

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      rememberMe: new FormControl(false)
    });
    this.route
    .queryParams
    .subscribe(params => {

      this.client_id = params['client_id'];
      this.redirect_uri = params['redirect_uri'];
      this.state = params['state'];
      this.response_type = params['response_type'];
    });
  }

  signin() {
    let self = this;
    const signinData = this.signinForm.value;
    this.submitButton.disabled = true;
    this.progressBar.mode = "indeterminate";
    this.sessionService.sessionSignIn(signinData).subscribe(
      data => {
        if (data) {
          // localStorage.setItem("user", JSON.stringify(data));
          console.log("data",data)
          self._snackBar.openFromComponent(NotificationComponent, {
            data: 'You Are Succesfully Login !',
            duration: 2000
          });
          // window.location.href = `https://oauth-redirect.googleusercontent.com/r/lucky-calculator-c272b?code=${data.sessionToken}&state=${data.state}`;
          // window.location.href = `https://oauth-redirect.googleusercontent.com/r/lucky-calculator-c272b#access_token=${data.idToken}&token_type=bearer&state=${data.state}`;
          // var redirectURL = `https://oauth-redirect.googleusercontent.com/r/lucky-calculator-c272b?code=${data.sessionToken}&state=${'data.state'}`;
          var redirectURL2 = `https://oauth-redirect.googleusercontent.com/r/lucky-calculator-c272b#access_token=${data.sessionToken}&token_type=bearer&state=${self.state}`;
          // var redirectURL3 = `https://oauth-redirect.googleusercontent.com/r/lucky-calculator-c272b#access_token=${data.sessionToken}&token_type=bearer&state=${data.state}`;
          // console.log("redirectURL",redirectURL);
          // console.log("redirectURL2",redirectURL2);
          window.location.href = redirectURL2;
          // window.location.href = `https://oauth-redirect.googleusercontent.com/r/lucky-calculator-c272b?code=${data.idToken}&state=${data.state}`;
          // return;
        }
      },
      err => {
        var message = JSON.parse(err["_body"]);
        var errorMsg = JSON.stringify(message);
        this.formErrors = "Something went wrong! Please try again Later.";
        this.submitButton.disabled = false;
      }
    );
  }
}
