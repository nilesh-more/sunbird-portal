import { UserService } from './../../../../services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'profile-visibility',
  templateUrl: './profile-visibility.component.html',
  styleUrls: ['./profile-visibility.component.css']
})
export class ProfileVisibilityComponent implements OnInit {
  @Input() update: boolean;
  @Input() field: string;
  isOpen: any;
  options = [{
    text: 'Hide this from everyone',
    value: 'private'
  },
  {
    text: 'Show this to all',
    value: 'public'
  }];
  user: any;
  profileVisibility: any;
  visibility: any;
  loader = {};
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.userData$.subscribe( user => {
      if (user) {
        if (!user.err) {
          this.user = user.userProfile;

          this.visibility = this.user.profileVisibility[this.field] ? 'private' : 'public';
        } else if (user.err) {
        }
      }
    });
  }
  setProfileFieldLbl(value) {

  }

}
