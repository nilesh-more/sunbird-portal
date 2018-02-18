import { ToasterService } from './services/toaster.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { PermissionDirective } from './directives/permission/permission.directive';
import { Ng2IziToastModule } from 'ng2-izitoast';

@NgModule({
  imports: [
    CommonModule, Ng2IziToastModule
  ],
  providers: [ToasterService],
  declarations: [AppLoaderComponent, PermissionDirective],
  exports: [AppLoaderComponent, PermissionDirective]
})
export class AppCommonModule { }
