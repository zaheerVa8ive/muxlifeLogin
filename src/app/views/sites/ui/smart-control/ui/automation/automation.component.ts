import { Component, OnInit ,  Output, EventEmitter } from '@angular/core';
import { SitesService } from 'app/views/sites/sites.service';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {

  @Output() automationDetails: EventEmitter<any> =   new EventEmitter();

  constructor(private siteServices : SitesService) { }

  userAssociatedAutomation : [];
  

  ngOnInit() {
    var info = localStorage.getItem('user');
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo['objectId'];
    this.getuserAssociatedAutomation(objectId);
  }

  public getuserAssociatedAutomation(id){
    this.siteServices.userAssociatedAutomation(id).subscribe(data => {
      this.userAssociatedAutomation = data['results'];
      console.log("28 , this.userAssociatedAutomation",this.userAssociatedAutomation);
    })
  }

  public selectedAutomation(automation){
    console.log("automation",automation);
    let editAuto  = automation;
    console.log("editAuto",editAuto);
    this.automationDetails.emit(editAuto);
  }

}
