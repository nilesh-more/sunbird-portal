import { PermissionService } from '../permission/permission.service';
import { Observable } from 'rxjs/Rx';
// import { PermissionService } from './permission/permission/.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { UserService } from '../user/user.service';
// import { UserService } from './user.service';

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
            console.log('auth gaurd permissionAvailable')
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
