import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { RoutePartsService } from "./shared/services/route-parts.service";
import { ThemeService } from './shared/services/theme.service';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = 'MuxLife';
  pageTitle = '';

  constructor(
    public title: Title, 
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private themeService: ThemeService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
  }

  ngAfterViewInit() {
    this.themeService.applyMatTheme(this.renderer)
  }
}
