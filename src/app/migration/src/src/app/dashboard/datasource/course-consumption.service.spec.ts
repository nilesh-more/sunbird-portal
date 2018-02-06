import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

// Services
import { CourseConsumptionService } from './course-consumption.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service';


describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, HttpModule],
      providers: [CourseConsumptionService, DashboardUtilsService]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));
});
