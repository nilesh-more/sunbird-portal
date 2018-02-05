import * as  config from './../../config/config.json';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PermissionService extends DataService {
  conFig = (<any>config);
  readPermissionsUrl = this.conFig.readPermissionsUrl;
  rolesAndPermissions: any[] = [];
  mainRoles: any[] = [];
  permissionAvailable = false;
  currentRoleActions: any[] = [];
  currentUserRoles: any[] = [];
  permissionAvailable$ = new BehaviorSubject<boolean>(this.permissionAvailable);
  constructor(public http: HttpClient, public userService: UserService) {
    super(http);
    this.getPermissionsData().subscribe(
      data => {
        this.setRolesAndPermissions(data);
      },
      err => {
        console.log('error in getting permission', err);
      }
    );
  }
  public getPermissionsData() {
    const option = {
      url: this.readPermissionsUrl
    };
    return this.get(option);
  }
  public setRolesAndPermissions(data) {
    const rolePermissions = _.cloneDeep(data.result.roles);
    _.forEach(rolePermissions, (r, p) => {
      const mainRole = { role: r.id, actions: [], roleName: r.name };
      this.mainRoles.push(mainRole);
      _.forEach(r.actionGroups, (ag) => {
        const subRole = { role: ag.id, actions: ag.actions, roleName: ag.name };
        mainRole.actions = _.concat(mainRole.actions, ag.actions);
        this.rolesAndPermissions.push(subRole);
      });
      this.rolesAndPermissions.push(mainRole);
    });
    this.rolesAndPermissions = _.uniqBy(this.rolesAndPermissions, 'role');
    this.setCurrentRoleActions();
  }
  public setCurrentRoleActions() {
    this.userService.userAvailable$.subscribe(
      profileAvailable => {
        if (profileAvailable) {
          this.currentUserRoles = this.userService.userRoles;
          _.forEach(this.userService.userRoles,  (r) => {
            const roleActions = _.filter(this.rolesAndPermissions, { role: r });
            if (_.isArray(roleActions) && roleActions.length > 0) {
              this.currentRoleActions = _.concat(this.currentRoleActions,
                _.map(roleActions[0].actions, 'id'));
            }
          });
          console.log('Permission available');
          this.permissionAvailable = true;
          this.permissionAvailable$.next(true);
        } else {

        }
      }
    );
  }
  public checkRolesPermissions(data, flag) {
    if (this.currentUserRoles && this.currentUserRoles.length > 0) {
      if (!this.checkActionsPermissions(data, flag)) {
        if (_.isArray(data)) {
          if ((_.intersection(data, this.currentUserRoles).length === 0) && !flag) {
            return true;
          }
          return ((_.intersection(data, this.currentUserRoles).length > 0) && flag);
        }
      } else {
        return true;
      }
    }
    return false;
  }

  checkActionsPermissions(data, flag) {
    if (_.isArray(data)) {
      if ((_.intersection(data, this.currentRoleActions).length === 0) && !flag) {
        return false;
      }
      return ((_.intersection(data, this.currentRoleActions).length > 0) && flag);
    }
    return false;
  }
}
