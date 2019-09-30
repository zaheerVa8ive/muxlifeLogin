import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import { httpClientInMemBackendServiceFactory } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }
  
  public getInfo(){
    const user = localStorage.getItem('user');
    const userInformation = JSON.parse(user);
    const objectId = userInformation['objectId'];
    let url = `${environment.baseUrl}api/functions/getCorporatePanelHomeStatistics`;
    let httpHeaders = new HttpHeaders({
        // 'Content-Type': 'application/json', 
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'POST',
        'X-Parse-Application-Id' : 'lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1',
        'X-Parse-REST-API-Key': 'tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD'
         });    
   let params = { 'userId' :  objectId}     
    return this.http.post(url, params, { headers: httpHeaders, observe: 'response' });
  }
}
