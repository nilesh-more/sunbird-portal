import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { PermissionDirective } from './directives/permission/permission.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [AppLoaderComponent, PermissionDirective],
  exports: [AppLoaderComponent, PermissionDirective]
})
export class AppCommonModule { }
