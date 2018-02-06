import { PermissionService } from './../services/permission/permission.service';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  @Input() permission: string;
    constructor(public el: ElementRef, public permissionService: PermissionService) {
    }
    ngOnInit() {
      this.permissionService.permissionAvailable$.subscribe(
        permissionAvailable => {
          if (permissionAvailable) {
            if (!this.permissionService.checkRolesPermissions(this.permission, true)) {
              this.el.nativeElement.remove();
            }
          } else {
            console.log('Permission not avilable');
          }
        }
      );
    }

}
