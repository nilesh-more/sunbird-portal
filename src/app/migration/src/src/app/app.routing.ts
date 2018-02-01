import { ProfileComponent } from './main-view/profile/profile.component';
import { CommunityListComponent } from './main-view/community-list/community-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { RouteResolveService } from './services/route-resolve.service';
import { AuthGuardComponent } from './random/auth-guard/auth-guard.component';
import { CourseConsumptionDashboardComponent } from './dashboard/course-consumption/course-consumption.component'

const appRoutes: Routes = [
    {
        path: 'migration/groups',
        component: CommunityListComponent,
        canActivate: [
            'CanActivate',
        ]
    },
    {
        path: 'migration/profile',
        component: ProfileComponent,
        canActivate: [
            'CanActivate',
        ]
    },
    {
        path: 'migration/auth',
        component: AuthGuardComponent,
        resolve: {
            profile: RouteResolveService
        },
        canActivate: [
            AuthGuard,
        ]
    },
    {
        path: 'migration/myactivity',
        component: CourseConsumptionDashboardComponent,
        canActivate: [
            'CanActivate',
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [
    RouteResolveService,
    {
      provide: 'CanActivate',
      useValue: ( ) => {
        return true;
      }
    }
  ]
})
export class AppRoutingModule { }
