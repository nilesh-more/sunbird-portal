import { UserService } from './../services/user/user.service';
import { PermissionService } from './../services/permission/permission.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private permissionService: PermissionService, private userService: UserService) {
  }
  canActivate(): Observable<any> {
    return this.getPermission();
  }
  getPermission() {
    return Observable.create(observer => {
      this.permissionService.permissionAvailable$.subscribe(
        permissionAvailable => {
          if (permissionAvailable) {
            observer.next(true);
            observer.complete();
            console.log('auth gaurd permissionAvailable');
            // permission check
          } else {
            console.log('Permission not avilable');
          }
        }
      );
    });
  }
  canActivateChild() {
    return true;
  }
}
// canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
//   // get route to be activated
//   this.routeToActivate = route.routeConfig.path;

//   // get user access
//   return this.permissionService.permissionAvailable$
//       .map(permissionAvailable => {
//          // check permission
//          return true;
//        })
//       .first(); // for the observable to complete on the first event (usually required for `canActivate`)
//       // first needs to be imported like map
// }
