import { Component, OnInit , Input } from '@angular/core';
import { SitesService } from 'app/views/sites/sites.service';

@Component({
  selector: 'app-automationdetails',
  templateUrl: './automationdetails.component.html',
  styleUrls: ['./automationdetails.component.scss']
})
export class AutomationdetailsComponent implements OnInit {

  constructor( private siteServices : SitesService ) { }

  @Input() automationId: any;
  automationData:any =[];
  userautoData : any =[];

  ngOnInit() {
    var info = localStorage.getItem('user');
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo['objectId'];
    this.siteServices.userAssociatedAutomationDevices(this.automationId).subscribe(userautoData => {
      this.userautoData = userautoData['results'];
      this.siteServices.getRooms(objectId).subscribe(data => {
        this.createAutomationData(data);
      });
    });
  }

  createAutomationObject(rooms){
    let autoData = [];
    for (let j = 0 ; j < rooms.length; j++){
      let room = rooms[j];
      let roomId = rooms[j]['objectId'];
      room['selectedDevices'] = [];
      room['notSelectedDevices'] = [];
      this.siteServices.associatedRoomDevices(roomId).subscribe(data => {
        let devices = data['results'];
        for (let h = 0 ; h < devices.length; h++){
          let userautoData = this.userautoData;
          let keyMatch = false;
          for (let d = 0 ; d < userautoData.length ; d++){
            if (userautoData[d]['device']['objectId'] == devices[h]['device']['objectId']){
              keyMatch = true;
            }
          }
          if (keyMatch){
            room['selectedDevices'].push(devices[h]);
          }
          else {
            room['notSelectedDevices'].push(devices[h]);
          }
        }
      });
      autoData.push(room);
    }
    return autoData;
  }

  async createAutomationData(data){
    let rooms = data['results'];
    let automationObject = await this.createAutomationObject(rooms);
    this.automationData = automationObject;
    console.log("this.automationData",this.automationData);
  }

}
