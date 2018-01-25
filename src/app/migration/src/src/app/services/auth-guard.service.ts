import { Observable } from 'rxjs/Rx';
import { PermissionService } from './permission.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ProfileService } from './profile.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private permissionService: PermissionService, private profileService: ProfileService) {
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
          } else {
            // console.log('Permission not avilable');
          }
        }
      );
    });
  }
  canActivateChild() {
    return true;
  }
}
