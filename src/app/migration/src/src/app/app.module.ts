import { AnnouncementService } from './services/announcement/announcement.service';
import { ContentService } from './services/content/content.service';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { AppLoaderComponent } from './components/common/app-loader/app-loader.component';
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
import { PermissionDirective } from './directives/permission.directive';
import { ResourceService } from './services/resource/resource.service';
import { MainHeaderComponent } from './components/header/main-header/main-header.component';
import { MainMenuComponent } from './components/header/main-menu/main-menu.component';
import { ProfileHeaderComponent } from './components/profile/profile-header/profile-header.component';
import { ProfileViewComponent } from './components/profile/profile-view/profile-view.component';
import { AuthGuard } from './auth-guards/auth-guard.service';
import { LearnerService } from './services/learner/learner.service';
// Dashboards component
import { CourseConsumptionDashboardComponent } from './dashboard/course-consumption/course-consumption.component';
import { OrganisationComponent } from './dashboard/organisation/organisation.component';
// Dashboard service
import { CourseConsumptionService } from './dashboard/datasource/course-consumption.service';
import { OrganisationService } from './dashboard/datasource/organisation.service';
import { DownloadService } from './dashboard/datasource/download.service';
import { DashboardUtilsService } from './dashboard/datasource/dashboard-utils.service'
import { SearchService } from './services/search.service';
import { RendererService } from './dashboard/renderer/renderer.service';
import { LineChartService } from './dashboard/renderer/graph/lineChart.service';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    ProfileComponent,
    AuthGuardComponent,
    PermissionDirective,
    ProfileComponent,
    AppLoaderComponent,
    ProfileHeaderComponent,
    ProfileViewComponent,
    CourseConsumptionDashboardComponent,
    OrganisationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule,
    FormsModule,
    ChartsModule
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
    CourseConsumptionService,
    OrganisationService,
    DownloadService,
    DashboardUtilsService,
    RendererService,
    LineChartService,
    SearchService
  ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
