import { Component, OnInit  , Input} from '@angular/core';

@Component({
  selector: 'app-online-status',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.scss']
})
export class OnlineStatusComponent implements OnInit {
  @Input() onlineStatusMessage: string;
  @Input() onlineStatus: string;
  constructor() { }

  ngOnInit() {
  }

}
