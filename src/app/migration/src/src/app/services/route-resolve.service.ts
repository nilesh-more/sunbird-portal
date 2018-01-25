import { PermissionService } from './permission.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { Resolve } from '@angular/router/src/interfaces';
import { ProfileService } from './profile.service';

@Injectable()
export class RouteResolveService implements Resolve<any> {// implements Resolve<migration>
  constructor(public permissionService: PermissionService, private profileService: ProfileService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.getProfile();
  }
  getProfile() {
    return Observable.create(observer => {
      this.profileService.profileAvailable$.subscribe(
        profileAvailable => {
          if (profileAvailable) {
            observer.next({
              id: 1,
              name: 'np test',
              role: 'creator'
            });
            observer.complete();
          }
        }
      );
    });
  }
}
