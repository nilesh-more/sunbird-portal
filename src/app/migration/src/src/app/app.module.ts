import { Ng2IziToastModule } from 'ng2-izitoast';
import { BadgesService } from './services/badges/badges.service';
import { AppCommonModule } from './modules/common/common.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AnnouncementService } from './services/announcement/announcement.service';
import { ContentService } from './services/content/content.service';
import { AuthGuardComponent } from './../random/auth-guard/auth-guard.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { SearchComponent } from './components/header/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService } from './services/resource/resource.service';
import { MainHeaderComponent } from './components/header/main-header/main-header.component';
import { MainMenuComponent } from './components/header/main-menu/main-menu.component';
import { AuthGuard } from './auth-guards/auth-guard.service';
import { LearnerService } from './services/learner/learner.service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    AuthGuardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule,
    FormsModule,
    ProfileModule,
    AppCommonModule,
    DashboardModule
  ],
  providers: [
    RouteResolveService,
    UserService,
    PermissionService,
    AuthGuard,
    ResourceService,
    LearnerService,
    ContentService,
    AnnouncementService,
    BadgesService,
    {
      provide: 'USER_ID',
      useFactory: ( ) => {
        return (<HTMLInputElement>document.getElementById('userId')).value;
      }
    }
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
