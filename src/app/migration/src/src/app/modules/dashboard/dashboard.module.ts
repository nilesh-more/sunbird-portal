import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CourseConsumptionComponent } from './components/course-consumption/course-consumption.component';
import { OrgConsumptionComponent } from './components/org-consumption/org-consumption.component';
import { OrgCreationComponent } from './components/org-creation/org-creation.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [CourseConsumptionComponent, OrgConsumptionComponent, OrgCreationComponent]
})
export class DashboardModule { }
