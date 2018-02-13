import { SuiModule } from 'ng2-semantic-ui';
import { ProfileEditService } from './services/profile-edit/profile-edit.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AppCommonModule } from '../common/common.module';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { UserAvtarComponent } from './components/user-avtar/user-avtar.component';
import { UserDescriptionComponent } from './components/user-description/user-description.component';
import { UserBadgesComponent } from './components/user-badges/user-badges.component';
import { UserExperienceComponent } from './components/user-experience/user-experience.component';
import { UserAddressComponent } from './components/user-address/user-address.component';
import { UserEducationComponent } from './components/user-education/user-education.component';
import { UserSkillsComponent } from './components/user-skills/user-skills.component';
import { UserBasicInfoComponent } from './components/user-basic-info/user-basic-info.component';
import { ProfileVisibilityComponent } from './components/profile-visibility/profile-visibility.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ProfilePageComponent,
    ProfileHeaderComponent,
    UserAvtarComponent,
    UserDescriptionComponent,
    UserBadgesComponent,
    UserExperienceComponent,
    UserAddressComponent,
    UserEducationComponent,
    UserSkillsComponent,
    UserBasicInfoComponent,
    ProfileVisibilityComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AppCommonModule,
    SuiModule,
    FormsModule
  ],
  providers: [ProfileEditService]
})
export class ProfileModule { }
