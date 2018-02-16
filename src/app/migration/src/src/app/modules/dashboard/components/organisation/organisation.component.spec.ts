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
import { OrganisationComponent } from './organisation.component';
import { ContentService } from './../../../../services/content/content.service';
import { UserService } from './../../../../services/user/user.service';
import { LearnerService } from './../../../../services/learner/learner.service';
import { OrganisationService } from './../../services/organisation/organisation.service';
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

  // When search api's return success response
  it('should call getOrganisationDetails function of search service', inject([OrganisationService, SearchService, UserService], (OrganisationService, SearchService, UserService) => {
    const mockRes = {"id":"api.org.search","ver":"v1","ts":"2018-02-16 10:11:00:783+0000","params":{"resmsgid":null,"msgid":"ca43ebb1-2f12-ebca-5923-d09ae980c440","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"response":{"count":2,"content":[{"dateTime":null,"preferredLanguage":null,"approvedBy":null,"channel":null,"description":null,"updatedDate":"2017-08-16 09:24:55:671+0000","addressId":null,"orgType":null,"provider":null,"orgCode":null,"theme":null,"id":"01229679766115942443","communityId":null,"isApproved":null,"slug":null,"identifier":"01229679766115942443","thumbnail":null,"orgName":"XYZ Institution","updatedBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","externalId":null,"isRootOrg":null,"rootOrgId":null,"approvedDate":null,"imgUrl":null,"homeUrl":null,"isDefault":null,"contactDetail":null,"createdDate":null,"createdBy":null,"parentOrgId":null,"hashTagId":null,"noOfMembers":1,"status":null},{"dateTime":null,"preferredLanguage":"English","approvedBy":null,"channel":null,"description":"NTP Content Create Testing","updatedDate":null,"addressId":"0123150128754360327","orgType":"Training","provider":null,"orgCode":"NCCT","theme":null,"id":"0123150108807004166","communityId":null,"isApproved":null,"slug":null,"identifier":"0123150108807004166","thumbnail":null,"orgName":"NTP Content Create Testing","updatedBy":null,"address":{"country":"India","updatedBy":null,"city":"Chennai","updatedDate":null,"userId":null,"zipcode":"45678","addType":null,"createdDate":"2017-08-21 06:26:13:394+0000","isDeleted":null,"createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","addressLine1":null,"addressLine2":null,"id":"0123150128754360327","state":"TN"},"externalId":null,"isRootOrg":false,"rootOrgId":"ORG_001","approvedDate":null,"imgUrl":null,"homeUrl":null,"isDefault":null,"contactDetail":null,"createdDate":"2017-08-21 06:26:13:393+0000","createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","parentOrgId":null,"hashTagId":"0123150108807004166","noOfMembers":1,"status":null}]}}};
    spyOn(SearchService, 'getOrganisationDetails').and.callFake(() => Observable.of(mockRes));
    component.getOrgDetails(['01229679766115942443', '0123150108807004166'])
    expect(component.showError).toBe(false)
    expect(component.showLoader).toBe(false)
    expect(component.myOrganisations.length).not.toBeUndefined()
  }));

  it('should call getOrganisationDetails function of search service', inject([OrganisationService, SearchService, UserService], (OrganisationService, SearchService, UserService) => {
    const mockRes = {"id":"api.org.search","ver":"v1","responseCode":"OK","result":{"response":{"count":6,"content":[{"dateTime":null,"preferredLanguage":"English","approvedBy":null,"channel":null,"description":"ABC Corporation","updatedDate":"2017-09-04 10:44:30:921+0000","addressId":"01230654297501696027","orgType":"Training","provider":null,"orgCode":"ABCL","theme":null,"id":"01230654824904294426","communityId":null,"isApproved":null,"slug":null,"identifier":"01230654824904294426","thumbnail":null,"orgName":"ABC Corporation","updatedBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","address":{"country":"India","updatedBy":null,"city":"Chennai","updatedDate":null,"userId":null,"zipcode":"45678","addType":null,"createdDate":"2017-08-09 07:20:29:343+0000","isDeleted":null,"createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","addressLine1":null,"addressLine2":null,"id":"01230654297501696027","state":"TN"},"externalId":null,"isRootOrg":false,"rootOrgId":"ORG_001","approvedDate":null,"imgUrl":null,"homeUrl":null,"isDefault":null,"contactDetail":null,"createdDate":"2017-08-09 07:20:29:342+0000","createdBy":"e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a","parentOrgId":null,"hashTagId":"01230654824904294426","noOfMembers":1,"status":null}]}}};
    spyOn(SearchService, 'getOrganisationDetails').and.callFake(() => Observable.of(mockRes));
    component.getOrgDetails(['01229679766115942443'])
    expect(component.showError).toBe(false)
  }));

  it('should call getOrganisationDetails function of search service', inject([OrganisationService, SearchService, UserService], (OrganisationService, SearchService, UserService) => {
    spyOn(SearchService, 'getOrganisationDetails').and.callFake(() => Observable.throw({}));
    component.getOrgDetails(['01229679766115942443'])
    expect(component.showError).toBe(true)
    expect(component.showLoader).toBe(false)
  }));

  // When Org creation api's return success response
  it('should call getDashboard function. Api success res - an Observable<Any<success>>', inject([OrganisationService, SearchService], (OrganisationService, SearchService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.org.creation","ver":"v1","ts":"2018-02-16 09:29:54:230+0000","params":{"resmsgid":null,"msgid":"23e70f1e-f3ab-4f28-8905-8330766b60f5","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"period":"7d","org":{"orgName":"ABC Corporation","orgId":"01230654824904294426"},"snapshot":{"org.creation.content.count":{"name":"Number of contents created","value":0.0},"org.creation.authors.count":{"name":"Number of authors","value":0},"org.creation.reviewers.count":{"name":"Number of reviewers","value":0},"org.creation.content[@status=draft].count":{"name":"Number of content items created","value":0},"org.creation.content[@status=review].count":{"name":"Number of content items reviewed","value":0},"org.creation.content[@status=published].count":{"name":"Number of content items published","value":0}},"series":{"org.creation.content[@status=draft].count":{"name":"Draft","split":"content.created_on","group_id":"org.content.count","buckets":[{"key":1518168594228,"key_name":"2018-02-09","value":0},{"key":1518254994228,"key_name":"2018-02-10","value":0},{"key":1518341394228,"key_name":"2018-02-11","value":0},{"key":1518427794228,"key_name":"2018-02-12","value":0},{"key":1518514194228,"key_name":"2018-02-13","value":0},{"key":1518600594228,"key_name":"2018-02-14","value":0},{"key":1518686994228,"key_name":"2018-02-15","value":0}]},"org.creation.content[@status=review].count":{"name":"Review","split":"content.reviewed_on","group_id":"org.content.count","buckets":[{"key":1518168594228,"key_name":"2018-02-09","value":0},{"key":1518254994228,"key_name":"2018-02-10","value":0},{"key":1518341394228,"key_name":"2018-02-11","value":0},{"key":1518427794228,"key_name":"2018-02-12","value":0},{"key":1518514194228,"key_name":"2018-02-13","value":0},{"key":1518600594228,"key_name":"2018-02-14","value":0},{"key":1518686994228,"key_name":"2018-02-15","value":0}]},"org.creation.content[@status=published].count":{"name":"Live","split":"content.published_on","group_id":"org.content.count","buckets":[{"key":1518168594229,"key_name":"2018-02-09","value":0},{"key":1518254994229,"key_name":"2018-02-10","value":0},{"key":1518341394229,"key_name":"2018-02-11","value":0},{"key":1518427794229,"key_name":"2018-02-12","value":0},{"key":1518514194229,"key_name":"2018-02-13","value":0},{"key":1518600594229,"key_name":"2018-02-14","value":0},{"key":1518686994229,"key_name":"2018-02-15","value":0}]}}}};
    spyOn(OrganisationService, 'getDashboardData').and.callFake(() => Observable.of(mockResponse));
    component.getDashboardData('7d', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.showDashboard).toBe(true);
    expect(component.showError).toBe(false)
  }));

  // When Org creation api's throw's error
  it('should call getMyContent function. Api failed res - an Observable<Any<err>>', inject([OrganisationService], (OrganisationService) => {
      spyOn(OrganisationService, 'getDashboardData').and.callFake(() => Observable.throw({}));
      component.getDashboardData('7d', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.showError).toEqual(true)
  }));

  it('should validate identifier and load dashboard data', () => {
    component.myOrganisations = [{identifier: 'do_123', name: 'Test 1'}]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
  }); 

  it('should throw invalidate identifier error and redirect to home page', () => {
    component.myOrganisations = [{identifier: 'do_1231'}]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
  }); 

  it('should call onAfterCourseChange - and load graph ', () => {
    component.identifier = 'do_2124319530479697921602'
    let response =  component.onAfterOrgChange('do_2124319530479697921602', 'Test 1')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterCourseChange function - but should not load graph', () => {
    component.identifier = 'do_2124319530479697921602'
    let response = component.onAfterOrgChange('do_21243195304796979216', 'Test 1')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterFilterChange function - but should not change time period', () => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('7d')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterFilterChange function - and display last 14 days data', () => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('14d')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should display next graph', () => {
    component.showGraph = 0
    component.graphNavigation('next')
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1)
  });
});
