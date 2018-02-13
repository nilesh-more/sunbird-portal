import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {
       path: 'migration/profile',
       component: ProfilePageComponent,
       children: [ {path: 'updateavatar',  component: ProfilePageComponent}]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
