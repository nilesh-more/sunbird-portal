import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent } from './components/organization/organization.component';
import { CourseConsumptionComponent } from './components/course-consumption/course-consumption.component';

const routes: Routes = [
  {
    path: 'migration/my-activity', component: CourseConsumptionComponent
  },
  {
    path: 'migration/dashboard/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent
  },
  {
    path: 'migration/org-dashboard', component: OrganisationComponent
  },
  {
    path: 'migration/dashboard/organization/:datasetType/:id/:timePeriod', component: OrganisationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
