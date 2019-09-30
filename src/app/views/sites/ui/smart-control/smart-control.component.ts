import { Component, OnInit } from '@angular/core';
import { SitesService } from '../../sites.service';



@Component({
  selector: 'app-smart-control',
  templateUrl: './smart-control.component.html',
  styleUrls: ['./smart-control.component.scss']
})
export class SmartControlComponent implements OnInit {

  userAssociatedScenes : [];
  userAssociatedAutomation : [];
  selectedSceneId : any;
  showScenes : boolean = true;
  automationDetail : boolean = true;
  automationobjectId :any;
  addScene : any = false;
  addAutomation : any = false;

  constructor( private siteServices : SitesService ) { 

   }

  ngOnInit() {
    this.automationDetail = false;
    var info = localStorage.getItem('user');
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo['objectId'];
    this.getuserAssociatedAutomation(objectId);
  }

 
  public getuserAssociatedAutomation(id){
    this.siteServices.userAssociatedAutomation(id).subscribe(data => {
      this.userAssociatedScenes = data['results'];
    })
  }
  

  dataView(arg){
    this.automationDetail = false;
    if ( arg == "scenes"){
      this.showScenes = true;
      this.addScene = false;
      this.addAutomation = false;
    } else {
      this.showScenes = false;
      this.addScene = false;
      this.addAutomation = false;
    }
  }

  automationSelected(objectId : any){
    this.addScene = false;
    this.addAutomation = true;
    this.automationobjectId = objectId;
  }

  editSceneIdSelected(editIdScene : any){
    this.addScene = true;
    this.addAutomation = false;
    this.selectedSceneId = editIdScene;
  }
  
  addScenes() : void{
    console.log("this.addEvent , ",this.addScene);
    this.addScene = true;
    this.addAutomation = false;
    this.selectedSceneId = null;
    console.log("this.addEvent , ",this.addScene);
  }

  onSceneCreated(created: boolean){
    console.log("created",created);
    this.addScene = false;
  }

  onAutomationCreated(created: boolean){
    console.log("created",created);
    this.addAutomation = false;
  }

  addAutomationEvent() : void{
    console.log("this.addAutomation , ",this.addAutomation);
    this.addScene = false;
    this.addAutomation = true;
    this.automationobjectId = null;
    console.log("this.addAutomation , ",this.addAutomation);
  }
}
