import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { SessionService } from 'app/views/sessions/session.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(public router: Router){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const auth = localStorage.getItem('user');
        const access_token = JSON.parse(auth);
        const auth1 = access_token['sessionToken'];
        //  const baseUrl: string = environment.baseUrl;
        //   if (req.url.includes(baseUrl+'/auth/local')) {
        //     return next.handle(req);
        //  }
          const apiReq = req.clone({
              url: `${req.url}`,
              setHeaders: {
                  Authorization: auth1
              },
          });
          return next.handle(apiReq);
  }
}

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: SessionService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
          if ([401, 403].indexOf(err.status) !== -1) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();
              location.reload(true);
          }

          const error = err.error.message || err.statusText;
          return throwError(error);
      }))
  }
}
