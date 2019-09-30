import { Component, EventEmitter, OnInit ,  Output} from '@angular/core';
import { SitesService } from 'app/views/sites/sites.service';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss']
})
export class ScenesComponent implements OnInit {

  constructor( private siteServices : SitesService) { }

  @Output() editSceneId =  new EventEmitter<any>();

  userAssociatedScenes : [];

  ngOnInit() {
    var info = localStorage.getItem('user');
    var objectInfo = JSON.parse(info);
    var objectId = objectInfo['objectId'];
    this.getuserAssociatedScenes(objectId);
  }

  public getuserAssociatedScenes(id){
    this.siteServices.userAssociatedScenes(id).subscribe(data => {
      this.userAssociatedScenes = data['results'];
      console.log("userAssociatedScenes",this.userAssociatedScenes)
    })
  }

  public btnExecute(objectId){
    var IdObj = { selectedSceneId : objectId};
    console.log("IdObj",IdObj);
    this.siteServices.scenesExecuton(IdObj).subscribe(data => {
      console.log('state',data['result']);
    });
  }

  public btnSecneEdit(sceneId){
    console.log("objectId",sceneId);
    let scene  = {
      'name': sceneId['name'],
      'objectId': sceneId['objectId']
    }
    this.editSceneId.emit(scene);
  }

}
