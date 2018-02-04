import { ProfileComponent } from './main-view/profile/profile.component';
import { CommunityListComponent } from './main-view/community-list/community-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { RouteResolveService } from './services/route-resolve.service';
import { AuthGuardComponent } from './random/auth-guard/auth-guard.component';
import { CourseConsumptionDashboardComponent } from './dashboard/course-consumption/course-consumption.component'
import { BreadcrumbsModule} from 'ng2-breadcrumbs';

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
        resolve: {
            profile: RouteResolveService
        },
        canActivate: [
            AuthGuard,
        ],
        data: {
            breadcrumb: ['Home', 'profile']
        }
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
        path: 'migration/myactivity',
        component: CourseConsumptionDashboardComponent,
        canActivate: [
            'CanActivate',
        ],
        data: {
            breadcrumb: ['Home', 'Profile', 'Course Creator Dashboard']
        }
    }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes),
            BreadcrumbsModule],
  exports: [RouterModule,
            BreadcrumbsModule],
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
