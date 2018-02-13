// Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Third party modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
// Components
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CourseConsumptionComponent } from './components/course-consumption/course-consumption.component';
import { OrganisationComponent } from './components/organisation/organisation.component';
// Services
import { SearchService } from './../../services/search/search.service';
import { DashboardUtilsService } from './services/dashboard-utils.service';
import { DashboardService } from './services/dashboard.service';
import { RendererService } from './services/renderer/renderer.service';
import { LineChartService } from './services/renderer/graphs/line-chart.service';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ChartsModule,
    SuiModule
  ],
  declarations: [CourseConsumptionComponent, OrganisationComponent],
  providers: [ 
    RendererService, 
    DashboardUtilsService, 
    SearchService, 
    LineChartService, 
    DashboardService]
})
export class DashboardModule { }