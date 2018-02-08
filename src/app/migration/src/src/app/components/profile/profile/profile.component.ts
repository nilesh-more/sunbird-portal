import { UserService } from './../../../services/user/user.service';
import { PermissionService } from './../../../services/permission/permission.service';
import { ResourceService } from './../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isError = false;
  showLoader = true;
  data = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...',
    showLoader: true
  };
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService) { }

  ngOnInit() {
  }
  eventHandler (data) {
    this.isError = true;
    console.log('got error', data);
  }
}
