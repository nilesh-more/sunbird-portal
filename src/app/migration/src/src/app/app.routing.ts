import { CommunityListComponent } from './main-view/community-list/community-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth-guard.service';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { AuthGuardComponent } from './random/auth-guard/auth-guard.component';
import { BreadcrumbsModule} from 'ng2-breadcrumbs';
import { ProfileComponent } from './profile/profile/profile.component';
import { CourseConsumptionDashboardComponent } from './dashboard/course-consumption/course-consumption.component'
import { OrganisationComponent } from './dashboard/organisation/organisation.component';

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
        component: ProfileComponent
    },
    {
        path: 'migration/auth',
        component: AuthGuardComponent,
        resolve: {
            profile: RouteResolveService
        },
        canActivate: [
            AuthGuard,
        ],
        data: {
            breadcrumb: ['Home', 'auth']
        }
    },
    {
        path: 'migration/course-creator-dashboard',
        component: CourseConsumptionDashboardComponent,
        canActivate: [
            'CanActivate',
        ],
        data: {
            breadcrumb: ['Home', 'Profile', 'Course Creator Dashboard']
        }
    },
    {
        path: 'migration/org-dashboard',
        component: OrganisationComponent,
        canActivate: [
            'CanActivate',
        ],
        data: {
            breadcrumb: ['Home', 'Profile', 'Organisation Dashboard']
        }
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
