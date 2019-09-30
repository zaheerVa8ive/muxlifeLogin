import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppLoaderComponent implements OnInit {
  title;
  message;
  constructor(public dialogRef: MatDialogRef<AppLoaderComponent>) {}

  ngOnInit() {
  }

}
