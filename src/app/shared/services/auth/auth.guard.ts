import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  private isAuthenticated = true; // Set this value dynamically
  
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var getToken = (localStorage.getItem('user'));
    var getName  =  JSON.parse(getToken);
    // this.authToken = getName['token'];
    let user = JSON.parse(localStorage.getItem('user'));
      if(user){
        return true;
      }
    this.router.navigate(['/sessions/signin']);
    return false;
  }
}