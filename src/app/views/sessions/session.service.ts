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
export class SessionService {
 
  public baseUrl : any = environment['baseUrl'];  
  private token: string;
  constructor(private http: Http , private router : Router) {
    
   }

  public sessionSignup(user){
    return this.http.post(this.baseUrl + 'api/users/' , user)
  }
  public sessionSignIn(user){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('X-Parse-Application-Id','lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1');
    headers.append('X-Parse-REST-API-Key','tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD');
    
    return this.http.post(this.baseUrl + 'api/login' , user , {headers : headers})
    .map(res => res.json());
  }
  public getProfile(){
    return this.http.get(this.baseUrl + 'auth/local/me');
  }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public logout(): void  {
    localStorage.removeItem('user');
    localStorage.clear();
    this.router.navigateByUrl('/sessions/signin');
  }
  public forgotPasswordApi(email) {
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('X-Parse-Application-Id','lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1');
    headers.append('X-Parse-REST-API-Key','tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD');
    
    let url = `${environment.baseUrl}api/functions/resetPassword14Digits`;
      
    let params = { 'userEmail' :  email}     
    return this.http.post(url, params, {headers : headers})
    .map(res => res.json());
  }
 
}