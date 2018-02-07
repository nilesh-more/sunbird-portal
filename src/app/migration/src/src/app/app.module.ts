import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './header/main-header/main-header.component';
import { MainMenuComponent } from './header/main-menu/main-menu.component';
import { SearchComponent } from './header/search/search.component';
import { CommunityListComponent } from './main-view/community-list/community-list.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { AuthGuard } from './services/auth-guard/auth-guard.service';
import { RouteResolveService } from './services/route-resolve/route-resolve.service';
import { AuthGuardComponent } from './random/auth-guard/auth-guard.component';
import { SuiModule } from 'ng2-semantic-ui';
// Dashboards
import { CourseConsumptionDashboardComponent } from './dashboard/course-consumption/course-consumption.component';
import { CourseConsumptionService } from './dashboard/datasource/course-consumption.service';
import { OrganisationService } from './dashboard/datasource/organisation.service';
import { DownloadService } from './dashboard/datasource/download.service';
import { DashboardUtilsService } from './dashboard/datasource/dashboard-utils.service'
import { SearchService } from './services/search.service'
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { OrganisationComponent } from './dashboard/organisation/organisation.component';
import { RendererService } from './dashboard/renderer/renderer.service';
import { LineChartService } from './dashboard/renderer/graph/lineChart.service';
import { PermissionDirective } from './directive/permission.directive';
import { ResourceService } from './services/resource/resource.service';
import { ProfileComponent } from './profile/profile/profile.component';
import { AppLoaderComponent } from './common/component/app-loader/app-loader.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainMenuComponent,
    SearchComponent,
    CommunityListComponent,
    CourseConsumptionDashboardComponent,
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
    CourseConsumptionService,
    OrganisationService,
    DownloadService,
    DashboardUtilsService,
    RendererService,
    LineChartService,
    SearchService,
    ResourceService
  ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
