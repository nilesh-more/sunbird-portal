import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';
import * as roleConfig from './../../../../config/roles.config.json';
@Component({
  selector: 'user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.css']
})
export class UserAddressComponent implements OnInit {
  user: any;
  roleconFig = (<any>roleConfig);
  addressForm = false;
  isNewAddress = false;
  newAddress = {};
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService) { }

  ngOnInit() {
    this.userService.userData$.subscribe( user => {
      if (user) {
        if (!user.err) {
          this.user = user.userProfile;
        } else if (user.err) {
        }
      }
    });
  }
  cancelEditAddress() {
    this.addressForm = false;
  }
  deleteAddress(deletedExp) {

  }
}
