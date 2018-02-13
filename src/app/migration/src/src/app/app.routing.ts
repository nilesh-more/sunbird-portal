import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { AuthGuard } from './auth-guards/auth-guard.service';

const appRoutes: Routes = [
    {
        path: 'migration/groups',
        component: CommunityListComponent,
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
        ],
        data: {
            breadcrumb: ['Home', 'auth']
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
