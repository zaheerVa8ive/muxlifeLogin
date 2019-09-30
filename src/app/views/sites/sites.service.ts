import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class SitesService {
  constructor(private http: HttpClient) {}

  public getRooms(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/Room?count=-1&limit=10000&where=
    {"user":{"__type":"Pointer","className":"_User","objectId":"${id}"}}`,
      { headers }
    );
  }
  public getAllDevices(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/Device?count=-1&limit=10000&where={"registeredUser": {
      "__type": "Pointer",
      "className": "_User",
      "objectId": "${id}"
  }}&include=primaryDeviceType&include=deviceSetting&include=deviceSetting.smartBlindsStateType&include=device.SmartBlindsStateType&include=deviceSetting&include=deviceSetting.dimmerStateType`,
      { headers }
    );
  }
  public associatedRoomDevices(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/AssociatedRoomDevices?count=-1&include=room&include=device&include=device.deviceSetting&include=device.deviceSetting.smartBlindsStateType&limit=10000&where={"room": {
      "__type": "Pointer",
      "className": "Room",
      "objectId": "${id}"
    }}&include=device.primaryDeviceType&include=device.SmartBlindsStateType&include=device.dimmerStateType&include=device.deviceSetting.dimmerStateType `,
      { headers }
    );
  }
  public dimmerStateTypeDevices(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/DimmerStateType?count=-1&limit=10000&where={"objectId": "${id}"}`,
      { headers }
    );
  }
  public smartRemoteDevice(deviceObjectId) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/AssociatedRemoteDevices?count=-1&limit=10000&include=device.remoteDeviceModel&where={"device": {
      "__type": "Pointer",
      "className": "Device",
      "objectId": "${deviceObjectId}"
      }}&include=remoteDeviceType&include=remoteDeviceModel&include=remoteDeviceModel.make`,
      { headers }
    );
  }
  public remoteDeviceAcMake(deviceType, deviceModel, deviceModelName) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/RemoteAc?count=-1&limit=4&where={"type": "${deviceType}","make": "${deviceModel}","model": "${deviceModelName}"}&include=remoteType&include=remoteMake&include=remoteModel`,
      { headers }
    );
  }
  public remoteDeviceMultiMediaMake(deviceType, deviceModel, deviceModelName) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/RemoteMultimedia?count=-1&limit=4&where={"type": "${deviceType}","make": "${deviceModel}","model": "${deviceModelName}"}&include=remoteType&include=remoteMake&include=remoteModel`,
      { headers }
    );
  }
  public remoteDeviceTvMake(deviceType, deviceModel, deviceModelName) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/RemoteTv?count=-1&limit=4&where={"type": "${deviceType}","make": "${deviceModel}","model": "${deviceModelName}"}&include=remoteType&include=remoteMake&include=remoteModel`,
      { headers }
    );
  }
  public userAssociatedAutomation(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/Automation?count=-1&limit=10000&where={"user": {
        "__type": "Pointer",
        "className": "_User",
        "objectId":"${id}"
      }}`,
      { headers }
    );
  }
  public scenesExecuton(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.post(
      `${environment.baseUrl}api/functions/triggerScene`,
      id,
      { headers }
    );
  }

  public userAssociatedScenes(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/Scene?count=-1&limit=10000&where={"user": {
        "__type": "Pointer",
        "className": "_User",
        "objectId":"${id}"
      }}`,
      { headers }
    );
  }
  public userAssociatedAutomationDevices(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/AssociatedAutomationDevices?count=-1&limit=10000&include=deviceSetting.DeviceSetting&where={"automation": {
      "__type": "Pointer",
      "className": "Automation",
      "objectId":"${id}"
    }}`,
      { headers }
    );
  }
  public associatedSceneDevicesbyId(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(
      `${environment.baseUrl}api/classes/AssociatedSceneDevices?count=-1&limit=10000&include=deviceSetting.DeviceSetting&where={"scene": {
      "__type": "Pointer",
      "className": "Scene",
      "objectId":"${id}"
    }}`,
      { headers }
    );
  }
  
  public deleteAssociatedSceneDevices(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.delete(`${environment.baseUrl}api/classes/AssociatedSceneDevices/${id}`, { headers});
  }
  public sceneUpdate(updateData,id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.put(`${environment.baseUrl}api/classes/Scene/${id}`, updateData, { headers});
  }
  public sceneCreation(postData) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.post(`${environment.baseUrl}api/classes/Scene`, postData, {
      headers
    });
  }
  public deleteAssociatedAutomationDevices(id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.delete(`${environment.baseUrl}api/classes/AssociatedAutomationDevices/${id}`, { headers});
  }
  public AutomationCreation(postData) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.post(`${environment.baseUrl}api/classes/Automation`,postData,{ headers }
    );
  }
  public AutomationUpdate(updateData,id) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.put(`${environment.baseUrl}api/classes/Automation/${id}`,updateData,{ headers }
    );
  }
  public AssociatedAutomationDevices(postData) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.post(
      `${environment.baseUrl}api/classes/AssociatedAutomationDevices`,
      postData,
      { headers }
    );
  }
  public AssociatedSceneDevices(postData) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.post(`${environment.baseUrl}api/classes/AssociatedSceneDevices`,postData,{ headers });
  }
  public DeviceSettingObject(postData) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.post(`${environment.baseUrl}api/classes/DeviceSetting`,postData,{ headers });
  }

  public AssocSceneSmartRemoteDevices(postData){
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
    .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
  return this.http.post(`${environment.baseUrl}api/classes/AssociatedSceneSmartRemoteDevices`,postData,{ headers });
  }

  public AssocAutomationSmartRemoteDevices(postData){
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
    .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
  return this.http.post(`${environment.baseUrl}api/classes/AssociatedAutomationSmartRemoteDevices`,postData,{ headers });
  }

  public dimmerStateTypeBytypeValue(typeValue) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("X-Parse-Application-Id", "lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1")
      .set("X-Parse-REST-API-Key", "tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD");
    return this.http.get(`${environment.baseUrl}api/classes/DimmerStateType?&where={"typeValue": "${typeValue}"}`,{ headers });
  }
}
