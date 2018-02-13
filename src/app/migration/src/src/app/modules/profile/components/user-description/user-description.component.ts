import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';
import * as roleConfig from './../../../../config/roles.config.json';
@Component({
  selector: 'user-description',
  templateUrl: './user-description.component.html',
  styleUrls: ['./user-description.component.css']
})
export class UserDescriptionComponent implements OnInit {
  user: any;
  public openDiscriptionEdit = false;
  privateProfileFields = true;
  readMore = false;
  roleconFig = (<any>roleConfig);
  editSummury: any;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService) { }

  ngOnInit() {
    this.userService.userData$.subscribe( user => {
      if (user) {
        if (!user.err) {
          this.user = user.userProfile;
          this.editSummury = this.user.profileSummary;
        } else if (user.err) {
        }
      }
    });
  }
  editDetails(editedSummury) {
    this.openDiscriptionEdit = false;
    console.log(editedSummury);
  }

}
