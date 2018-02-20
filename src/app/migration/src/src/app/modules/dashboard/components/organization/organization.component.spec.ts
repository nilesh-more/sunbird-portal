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
import { OrganisationComponent } from './organization.component';
import { ContentService } from './../../../../services/content/content.service';
import { UserService } from './../../../../services/user/user.service';
import { LearnerService } from './../../../../services/learner/learner.service';
import { OrganisationService } from './../../services/organization/organization.service';
import { SearchService } from './../../../../services/search/search.service';
import { DashboardUtilsService } from './../../services/dashboard-utils.service';
import { RendererService } from './../../services/renderer/renderer.service';
import { LineChartService } from './../../services/renderer/graphs/line-chart.service';

describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  let creationDataset = 'creation';
  let consumptionDataset = 'consumption';
  let dashboardBaseUrl = 'migration/dashboard/organization';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationComponent ],
      imports:[HttpClientTestingModule, FormsModule, SuiModule, ChartsModule],
      providers: [LearnerService, 
        LineChartService, 
        OrganisationService, 
        SearchService, 
        DashboardUtilsService,
        RendererService,
        LineChartService,
        ContentService,
        UserService,
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
  it('should call search api to get details of more than 1 org', inject([OrganisationService, SearchService, UserService], (OrganisationService, SearchService, UserService) => {
    const mockRes = {"id":"api.org.search","ver":"v1","ts":"2018-02-16 10:11:00:783+0000","params":{"resmsgid":null,"msgid":"ca43ebb1-2f12-ebca-5923-d09ae980c440","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"response":{"count":2,"content":[{"dateTime":null,"preferredLanguage":null,"approvedBy":null,"channel":null,"description":null,"updatedDate":"2017-08-16 09:24:55:671+0000","addressId":null,"orgType":null,"provider":null,"orgCode":null,"theme":null,"id":"01229679766115942443","communityId":null,"isApproved":null,"slug":null,"identifier":"01229679766115942443","thumbnail":null,"orgName":"XYZ Institution","updatedBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","externalId":null,"isRootOrg":null,"rootOrgId":null,"approvedDate":null,"imgUrl":null,"homeUrl":null,"isDefault":null,"contactDetail":null,"createdDate":null,"createdBy":null,"parentOrgId":null,"hashTagId":null,"noOfMembers":1,"status":null},{"dateTime":null,"preferredLanguage":"English","approvedBy":null,"channel":null,"description":"NTP Content Create Testing","updatedDate":null,"addressId":"0123150128754360327","orgType":"Training","provider":null,"orgCode":"NCCT","theme":null,"id":"0123150108807004166","communityId":null,"isApproved":null,"slug":null,"identifier":"0123150108807004166","thumbnail":null,"orgName":"NTP Content Create Testing","updatedBy":null,"address":{"country":"India","updatedBy":null,"city":"Chennai","updatedDate":null,"userId":null,"zipcode":"45678","addType":null,"createdDate":"2017-08-21 06:26:13:394+0000","isDeleted":null,"createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","addressLine1":null,"addressLine2":null,"id":"0123150128754360327","state":"TN"},"externalId":null,"isRootOrg":false,"rootOrgId":"ORG_001","approvedDate":null,"imgUrl":null,"homeUrl":null,"isDefault":null,"contactDetail":null,"createdDate":"2017-08-21 06:26:13:393+0000","createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","parentOrgId":null,"hashTagId":"0123150108807004166","noOfMembers":1,"status":null}]}}};
    spyOn(SearchService, 'getOrganisationDetails').and.callFake(() => Observable.of(mockRes));
    component.getOrgDetails(['01229679766115942443', '0123150108807004166'])
    expect(component.showError).toBe(false)
    expect(component.showLoader).toBe(false)
    expect(component.myOrganizations.length).not.toBeUndefined()
    expect(component.myOrganizations.length).toBeGreaterThanOrEqual(2)
  }));

  // If user is member of only one organization
  it('should call search api to get details of only org details', inject([OrganisationService, SearchService, UserService], (OrganisationService, SearchService, UserService) => {
    const mockRes = {"id":"api.org.search","ver":"v1","responseCode":"OK","result":{"response":{"count":6,"content":[{"dateTime":null,"preferredLanguage":"English","approvedBy":null,"channel":null,"description":"ABC Corporation","updatedDate":"2017-09-04 10:44:30:921+0000","addressId":"01230654297501696027","orgType":"Training","provider":null,"orgCode":"ABCL","theme":null,"id":"01230654824904294426","communityId":null,"isApproved":null,"slug":null,"identifier":"01230654824904294426","thumbnail":null,"orgName":"ABC Corporation","updatedBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","address":{"country":"India","updatedBy":null,"city":"Chennai","updatedDate":null,"userId":null,"zipcode":"45678","addType":null,"createdDate":"2017-08-09 07:20:29:343+0000","isDeleted":null,"createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","addressLine1":null,"addressLine2":null,"id":"01230654297501696027","state":"TN"},"externalId":null,"isRootOrg":false,"rootOrgId":"ORG_001","approvedDate":null,"imgUrl":null,"homeUrl":null,"isDefault":null,"contactDetail":null,"createdDate":"2017-08-09 07:20:29:342+0000","createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","parentOrgId":null,"hashTagId":"01230654824904294426","noOfMembers":1,"status":null}]}}};
    spyOn(SearchService, 'getOrganisationDetails').and.callFake(() => Observable.of(mockRes));
    component.getOrgDetails(['01229679766115942443'])
    expect(component.showError).toBe(false)
    expect(component.myOrganizations.length).not.toBeUndefined()
    expect(component.myOrganizations.length).toEqual(1)
  }));

  // When search api throws error
  it('should throw error while getting org details', inject([OrganisationService, SearchService, UserService], (OrganisationService, SearchService, UserService) => {
    spyOn(SearchService, 'getOrganisationDetails').and.callFake(() => Observable.throw({}));
    component.getOrgDetails(['01229679766115942443'])
    expect(component.showError).toBe(true)
    expect(component.showLoader).toBe(false)
    expect(component.myOrganizations.length).toEqual(0)
  }));

  // When Org creation APIs return success response
  it('should call creation api', inject([OrganisationService, SearchService], (OrganisationService, SearchService) => {
    const mockResponse = {"bucketData":{"org.creation.content[@status=draft].count":{"name":"Draft","split":"content.created_on","group_id":"org.content.count","buckets":[{"key":1518435525770,"key_name":"2018-02-12","value":0},{"key":1518521925770,"key_name":"2018-02-13","value":0},{"key":1518608325770,"key_name":"2018-02-14","value":0},{"key":1518694725770,"key_name":"2018-02-15","value":0},{"key":1518781125770,"key_name":"2018-02-16","value":0},{"key":1518867525770,"key_name":"2018-02-17","value":0},{"key":1518953925770,"key_name":"2018-02-18","value":0}]},"org.creation.content[@status=review].count":{"name":"Review","split":"content.reviewed_on","group_id":"org.content.count","buckets":[{"key":1518435525770,"key_name":"2018-02-12","value":0},{"key":1518521925770,"key_name":"2018-02-13","value":0},{"key":1518608325770,"key_name":"2018-02-14","value":0},{"key":1518694725770,"key_name":"2018-02-15","value":0},{"key":1518781125770,"key_name":"2018-02-16","value":0},{"key":1518867525770,"key_name":"2018-02-17","value":0},{"key":1518953925770,"key_name":"2018-02-18","value":0}]},"org.creation.content[@status=published].count":{"name":"Live","split":"content.published_on","group_id":"org.content.count","buckets":[{"key":1518435525770,"key_name":"2018-02-12","value":0},{"key":1518521925770,"key_name":"2018-02-13","value":0},{"key":1518608325770,"key_name":"2018-02-14","value":0},{"key":1518694725770,"key_name":"2018-02-15","value":0},{"key":1518781125770,"key_name":"2018-02-16","value":0},{"key":1518867525770,"key_name":"2018-02-17","value":0},{"key":1518953925770,"key_name":"2018-02-18","value":0}]}},"numericData":[{"name":"Number of contents created","value":0},{"name":"Number of authors","value":0},{"name":"Number of reviewers","value":0}],"series":["0 Created","0 IN REVIEW","0 LIVE"],"name":"Content created per day"};
    spyOn(OrganisationService, 'getDashboardData').and.callFake(() => Observable.of(mockResponse));
    component.getDashboardData('7d', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.showDashboard).toBe(true);
    expect(component.showError).toBe(false);
    expect(component.graphData.length).not.toBeUndefined();
    expect(component.blockData.length).toBeGreaterThanOrEqual(3)
    expect(component.graphData.length).toBeGreaterThanOrEqual(1)
  }));

  // When Org creation APIs throw's error
  it('should throw error - while getting org creation data', inject([OrganisationService], (OrganisationService) => {
      spyOn(OrganisationService, 'getDashboardData').and.callFake(() => Observable.throw({}));
      spyOn(component, 'setError').and.callThrough();
      component.getDashboardData('7d', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.setError).toHaveBeenCalledWith(true)
      expect(component.showError).toEqual(true)
      expect(component.showLoader).toBe(false)
      expect(component.blockData.length).toBe(0)
  }));

  it('should validate url identifier and load dashboard data', inject([Router], (Router) => {
    component.myOrganizations = [{identifier: 'do_123', name: 'Test 1'}]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
    expect(Router.navigate).not.toHaveBeenCalled()
  })); 

  it('should throw invalidate identifier error and redirect to other page', inject([Router], (Router) => {
    component.myOrganizations = [{identifier: 'do_1231', name: 'Test 1'}]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
    expect(component.SelectedOrg).not.toEqual('Test 1')
    expect(Router.navigate).toHaveBeenCalledWith(['migration/groups']);
  })); 

  it('should display selected org dashboard', inject([Router], (Router) => {
    let selectedOrgId = 'do_2124319530479697921602';
    component.datasetType = creationDataset;
    component.identifier = 'do_21243195304796979216021'; // Previously selected org
    let response =  component.onAfterOrgChange(selectedOrgId, 'Org 1')
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier === selectedOrgId).toBe(false);
    expect(Router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, 'creation', selectedOrgId, '7d'])
  }));

  it('should call onAfterCourseChange function - but should not load graph', inject([Router], (Router) => {
    // Previously selected org
    component.identifier = 'do_2124319530479697921602';
    // Selected org.
    let selectedOrgId = 'do_2124319530479697921602';
    // If both org are same then it should not load data again
    let response = component.onAfterOrgChange('do_2124319530479697921602', 'Test 1')
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier === selectedOrgId).toBe(true)
    expect(Router.navigate).not.toHaveBeenCalled()    
  }));

  it('should display selected timePeriod data', inject([Router], (Router) => {
    component.datasetType = 'creation';
    component.identifier = 'do_1234';
    component.timePeriod = '7d'; // Previous timePeriod
    let selectedTimePeriod = '14'; // Selected timePeriod
    let response = component.onAfterFilterChange(selectedTimePeriod)
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.timePeriod === selectedTimePeriod).toBe(false)
    expect(Router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, component.datasetType, component.identifier, selectedTimePeriod])
  }));

  it('should display selected timePeriod data', inject([Router], (Router) => {
    component.timePeriod = '7d'; // Previous timePeriod
    let selectedTimePeriod = '7d'; // Selected timePeriod
    let response = component.onAfterFilterChange(selectedTimePeriod)
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.timePeriod === selectedTimePeriod).toBe(true)
    expect(Router.navigate).not.toHaveBeenCalled();
  }));

  it('should not change dataset type', inject([Router], (Router) => {
    component.datasetType = consumptionDataset;
    let response = component.onAfterDatasetChange(consumptionDataset)
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.datasetType === consumptionDataset).toBe(true)
    expect(Router.navigate).not.toHaveBeenCalled();
  }));

  it('should not change dataset type', inject([Router], (Router) => {
    component.datasetType = consumptionDataset;
    component.identifier = 'do_123';
    let response = component.onAfterDatasetChange(creationDataset)
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.datasetType === creationDataset).toBe(false)
    expect(Router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, creationDataset, component.identifier, '7d'])
  }));

  it('should display next graph', () => {
    component.showGraph = 0
    component.graphNavigation('next')
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1)
  });
});
