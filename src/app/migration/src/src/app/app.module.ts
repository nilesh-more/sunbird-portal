import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './header/main-header/main-header.component';
import { MainMenuComponent } from './header/main-menu/main-menu.component';
import { SearchComponent } from './header/search/search.component';
import { CommunityListComponent } from './main-view/community-list/community-list.component';
import { AppRoutingModule } from './app.routing';
import { ProfileComponent } from './main-view/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileService } from './services/profile.service';
import { PermissionService } from './services/permission.service';
import { AuthGuard } from './services/auth-guard.service';
import { RouteResolveService } from './services/route-resolve.service';
import { AuthGuardComponent } from './random/auth-guard/auth-guard.component';
import { SuiModule } from 'ng2-semantic-ui';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    ProfileComponent,
    AuthGuardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule
  ],
  providers: [
    RouteResolveService,
    ProfileService,
    PermissionService,
    AuthGuard
  ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
