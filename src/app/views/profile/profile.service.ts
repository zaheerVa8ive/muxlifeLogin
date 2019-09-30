import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Http , Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
 
  constructor(private http: HttpClient , private router : Router) {
    
   }

   public editProfileFunc(addProfilePayload){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-Parse-Application-Id' , 'lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1')
    .set('X-Parse-REST-API-Key', 'tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD'); 
    return this.http.post(`${environment.baseUrl}api/functions/updateUser` ,addProfilePayload, {headers });
  }
}