// NG modules
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
// Modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
// Services
import {
  OrganisationComponent, OrganisationService, DashboardUtilsService, RendererService,
  LineChartService, DownloadService, AppCommonModule
} from './../../index';
import { ResourceService, UserService, SearchService, ContentService, LearnerService } from './../../../../services';

describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const creationDataset = 'creation';
  const consumptionDataset = 'consumption';
  const dashboardBaseUrl = 'migration/dashboard/organization';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationComponent],
      imports: [HttpClientTestingModule, FormsModule, SuiModule, ChartsModule, AppCommonModule],
      providers: [LearnerService,
        LineChartService,
        OrganisationService,
        SearchService,
        DashboardUtilsService,
        RendererService,
        ContentService,
        UserService,
        DownloadService,
        ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // If user is a member of more than one organization
  it('should call search api to get details of more than 1 org', inject([OrganisationService, SearchService, UserService],
    (organisationService, searchService, userService) => {
      const mockRes = { 'responseCode': 'OK', 'result': { 'response': { 'count': 2, 'content': [{ 'identifier': '01229679766115942443',
      'orgName': 'XYZ Institution' }, { 'identifier': '0123150108807004166', 'orgName': 'NTP Content Create Testing' }]}}};
      spyOn(searchService, 'getOrganisationDetails').and.callFake(() => Observable.of(mockRes));
      component.getOrgDetails(['01229679766115942443', '0123150108807004166']);
      expect(component.showError).toBe(false);
      expect(component.showLoader).toBe(false);
      expect(component.myOrganizations.length).not.toBeUndefined();
      expect(component.myOrganizations.length).toBeGreaterThanOrEqual(2);
    }));

  // If user is member of only one organization
  it('should call search api to get details of only org details', inject([OrganisationService, SearchService, UserService],
    (organisationService, searchService, userService) => {
      const mockRes = {'responseCode': 'OK', 'result': {'response': {'count': 2, 'content': [{'identifier': '01229679766115942443',
      'orgName': 'XYZ Institution'}]}}};
      spyOn(searchService, 'getOrganisationDetails').and.callFake(() => Observable.of(mockRes));
      component.getOrgDetails(['01229679766115942443']);
      expect(component.showError).toBe(false);
      expect(component.myOrganizations.length).not.toBeUndefined();
      expect(component.myOrganizations.length).toEqual(1);
    }));

  // When search api throws error
  it('should throw error while getting org details', inject([OrganisationService, SearchService, UserService],
    (organisationService, searchService, userService) => {
      spyOn(searchService, 'getOrganisationDetails').and.callFake(() => Observable.throw({}));
      component.getOrgDetails(['01229679766115942443']);
      expect(component.showError).toBe(true);
      expect(component.showLoader).toBe(false);
      expect(component.myOrganizations.length).toEqual(0);
    }));

  // When Org creation APIs return success response
  it('should call creation api', inject([OrganisationService, SearchService],
    (organisationService, searchService) => {
      const mockResponse = { 'bucketData': { 'org.creation.content[@status=draft].count': { 'name': 'Draft',
      'split': 'content.created_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1518435525770, 'key_name': '2018-02-12',
      'value': 0 }, { 'key': 1518521925770, 'key_name': '2018-02-13', 'value': 0 }, { 'key': 1518608325770, 'key_name': '2018-02-14',
      'value': 0 }, { 'key': 1518694725770, 'key_name': '2018-02-15', 'value': 0 }, { 'key': 1518781125770, 'key_name': '2018-02-16',
      'value': 0 }, { 'key': 1518867525770, 'key_name': '2018-02-17', 'value': 0 }, { 'key': 1518953925770, 'key_name': '2018-02-18',
      'value': 0 }] }, 'org.creation.content[@status=review].count': { 'name': 'Review', 'split': 'content.reviewed_on',
      'group_id': 'org.content.count', 'buckets': [{ 'key': 1518435525770, 'key_name': '2018-02-12', 'value': 0 },
      { 'key': 1518521925770, 'key_name': '2018-02-13', 'value': 0 }, { 'key': 1518608325770, 'key_name': '2018-02-14', 'value': 0 },
      { 'key': 1518694725770, 'key_name': '2018-02-15', 'value': 0 }, { 'key': 1518781125770, 'key_name': '2018-02-16', 'value': 0 },
      { 'key': 1518867525770, 'key_name': '2018-02-17', 'value': 0 }, { 'key': 1518953925770, 'key_name': '2018-02-18', 'value': 0 }] },
      'org.creation.content[@status=published].count': { 'name': 'Live', 'split': 'content.published_on', 'group_id': 'org.content.count',
      'buckets': [{ 'key': 1518435525770, 'key_name': '2018-02-12', 'value': 0 }, { 'key': 1518521925770, 'key_name': '2018-02-13',
      'value': 0 }, { 'key': 1518608325770, 'key_name': '2018-02-14', 'value': 0 }, { 'key': 1518694725770, 'key_name': '2018-02-15',
      'value': 0 }, { 'key': 1518781125770, 'key_name': '2018-02-16', 'value': 0 }, { 'key': 1518867525770, 'key_name': '2018-02-17',
      'value': 0 }, { 'key': 1518953925770, 'key_name': '2018-02-18', 'value': 0 }] } },
      'numericData': [{ 'name': 'Number of contents created', 'value': 0 }, { 'name': 'Number of authors', 'value': 0 },
      { 'name': 'Number of reviewers', 'value': 0 }], 'series': ['0 Created', '0 IN REVIEW', '0 LIVE'], 'name': 'Content created per day' };
      spyOn(organisationService, 'getDashboardData').and.callFake(() => Observable.of(mockResponse));
      component.getDashboardData('7d', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.showDashboard).toBe(true);
      expect(component.showError).toBe(false);
      expect(component.graphData.length).not.toBeUndefined();
      expect(component.blockData.length).toBeGreaterThanOrEqual(3);
      expect(component.graphData.length).toBeGreaterThanOrEqual(1);
    }));

  // When Org creation APIs throw's error
  it('should throw error - while getting org creation data', inject([OrganisationService], (organisationService) => {
    spyOn(organisationService, 'getDashboardData').and.callFake(() => Observable.throw({}));
    spyOn(component, 'setError').and.callThrough();
    component.getDashboardData('7d', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.setError).toHaveBeenCalledWith(true);
    expect(component.showError).toEqual(true);
    expect(component.showLoader).toBe(false);
    expect(component.blockData.length).toBe(0);
  }));

  it('should validate url identifier and load dashboard data', inject([Router], (router) => {
    component.myOrganizations = [{ identifier: 'do_123', name: 'Test 1' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should throw invalidate identifier error and redirect to other page', inject([Router], (router) => {
    component.myOrganizations = [{ identifier: 'do_1231', name: 'Test 1' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(component.SelectedOrg).not.toEqual('Test 1');
    expect(router.navigate).toHaveBeenCalledWith(['migration/groups']);
  }));

  it('should display selected org dashboard', inject([Router], (router) => {
    const selectedOrgId = 'do_2124319530479697921602';
    component.datasetType = creationDataset;
    component.identifier = 'do_21243195304796979216021'; // Previously selected org
    const response = component.onAfterOrgChange(selectedOrgId, 'Org 1');
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier === selectedOrgId).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, 'creation', selectedOrgId, '7d']);
  }));

  it('should call onAfterCourseChange function - but should not load graph', inject([Router], (router) => {
    // Previously selected org
    component.identifier = 'do_2124319530479697921602';
    // Selected org.
    const selectedOrgId = 'do_2124319530479697921602';
    // If both org are same then it should not load data again
    const response = component.onAfterOrgChange('do_2124319530479697921602', 'Test 1');
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier === selectedOrgId).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should display selected timePeriod data', inject([Router], (router) => {
    component.datasetType = 'creation';
    component.identifier = 'do_1234';
    component.timePeriod = '7d'; // Previous timePeriod
    const selectedTimePeriod = '14'; // Selected timePeriod
    const response = component.onAfterFilterChange(selectedTimePeriod);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.timePeriod === selectedTimePeriod).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, component.datasetType, component.identifier, selectedTimePeriod]);
  }));

  it('should display selected timePeriod data', inject([Router], (router) => {
    component.timePeriod = '7d'; // Previous timePeriod
    const selectedTimePeriod = '7d'; // Selected timePeriod
    const response = component.onAfterFilterChange(selectedTimePeriod);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.timePeriod === selectedTimePeriod).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should not change dataset type', inject([Router], (router) => {
    component.datasetType = consumptionDataset;
    const response = component.onAfterDatasetChange(consumptionDataset);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.datasetType === consumptionDataset).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should not change dataset type', inject([Router], (router) => {
    component.datasetType = consumptionDataset;
    component.identifier = 'do_123';
    const response = component.onAfterDatasetChange(creationDataset);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.datasetType === creationDataset).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, creationDataset, component.identifier, '7d']);
  }));

  it('should display next graph', () => {
    component.showGraph = 0;
    component.graphNavigation('next');
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1);
  });

  it('should download dashboard report', inject([DownloadService], (downloadService) => {
    component.datasetType = 'creation';
    component.identifier = 'do_123';
    component.timePeriod = '7d';
    const mockRes = {'id': 'api.sunbird.dashboard.org.creation', 'responseCode': 'OK', 'result': { 'requestId': '0124452555998003206'}};
    spyOn(downloadService, 'getReport').and.callFake(() => Observable.of(mockRes));
    component.downloadReport();
    fixture.detectChanges();
    expect(component.showDownloadSuccessModal).toEqual(true);
    expect(component.disabledClass).toEqual(false);
  }));

  it('should not download dashboard report', inject([DownloadService], (downloadService) => {
    component.datasetType = 'creation';
    component.identifier = 'do_123';
    component.timePeriod = '7d';
    spyOn(downloadService, 'getReport').and.callFake(() => Observable.throw({}));
    component.downloadReport();
    fixture.detectChanges();
    expect(component.disabledClass).toEqual(false);
  }));
});
