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
import { DashboardRoutes } from "./dashboard.routing";
import { OverviewComponent } from './ui/overview/overview.component';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ColumnComponent } from './ui/charts/column/column.component';
import { BarChartComponent } from './ui/charts/bar-chart/bar-chart.component';
import { StackedComponent } from './ui/charts/stacked/stacked.component';
import { DashboardService } from './dashboard.service';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';



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
    FileUploadModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAIB73_M36MiQtAXNhYBQudnphyHeRZXHs",
      language : 'en',
      libraries: ['geometry', 'places']
    }),
    AgmJsMarkerClustererModule,
    SharedModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  providers : [DashboardService],
  declarations: [OverviewComponent, ColumnComponent, BarChartComponent, StackedComponent]
})
export class DashboardModule { }
