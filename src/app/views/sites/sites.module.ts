import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatProgressBarModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from './../../shared/shared.module';
import { SitesRoutes } from "./sites.routing";
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HomeComponent } from './ui/home/home.component';
import { StatisticComponent } from './ui/statistic/statistic.component';
import { SmartControlComponent } from './ui/smart-control/smart-control.component';
import { SettingsComponent } from './ui/settings/settings.component';
import { SiteOverviewComponent } from './site-overview/site-overview.component';
import { AddScenesComponent } from './ui/add-scenes/add-scenes.component';
import { RoomsComponent } from './ui/rooms/rooms.component';
import { SitesService} from './sites.service';
import { DimmerSocketComponent } from './ui/dimmer-socket/dimmer-socket.component';
import { SwitchboardSocketComponent } from './ui/switchboard-socket/switchboard-socket.component';
import { SmartRemoteOverviewComponent } from './ui/smart-remote-overview/smart-remote-overview.component';
import { SmartRemoteDeviceComponent } from './ui/smart-remote-device/smart-remote-device.component';
import {AutomationComponent } from '../sites/ui/smart-control/ui/automation/automation.component';
import { AutomationdetailsComponent} from '../sites/ui/smart-control/ui/automationdetails/automationdetails.component';
import { ScenesComponent} from '../sites/ui/smart-control/ui/scenes/scenes.component';
import { SmartBlindComponent } from './ui/smart-blind/smart-blind.component';
import { AddAutomationComponent } from './ui/add-automation/add-automation.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DeviceStatusCheckFormComponent } from './ui/device-status-check-form/device-status-check-form.component';
import { SmartLightDeviceComponent } from './ui/smart-light-device/smart-light-device.component';
import { ColorHueModule } from 'ngx-color/hue';
import { AddRoomsComponent } from './ui/add-rooms/add-rooms.component';
import { WallplugdisplaySceneAutomationComponent } from './ui/wallplugdisplay-scene-automation/wallplugdisplay-scene-automation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    FileUploadModule,
    GooglePlaceModule,
    ColorHueModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAIB73_M36MiQtAXNhYBQudnphyHeRZXHs",
      language : 'en',
      libraries: ['geometry', 'places']
    }),
    SharedModule,
    RouterModule.forChild(SitesRoutes)
  ],
  entryComponents : [AddScenesComponent , SwitchboardSocketComponent , SmartRemoteOverviewComponent , SmartRemoteDeviceComponent , DimmerSocketComponent , SmartBlindComponent , DeviceStatusCheckFormComponent , SmartLightDeviceComponent , WallplugdisplaySceneAutomationComponent],
  declarations: [HomeComponent, StatisticComponent, SmartControlComponent, ScenesComponent, AutomationdetailsComponent, AutomationComponent, SettingsComponent, SiteOverviewComponent, AddScenesComponent, RoomsComponent, DimmerSocketComponent, SwitchboardSocketComponent, SmartRemoteOverviewComponent, SmartRemoteDeviceComponent, SmartBlindComponent, DeviceStatusCheckFormComponent, AddAutomationComponent,SmartLightDeviceComponent, AddRoomsComponent, WallplugdisplaySceneAutomationComponent],
  providers : [SitesService]
})
export class SitesModule { }
