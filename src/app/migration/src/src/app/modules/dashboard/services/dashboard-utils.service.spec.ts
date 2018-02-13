import { TestBed, inject } from '@angular/core/testing';

import { DashboardUtilsService } from './dashboard-utils.service';

describe('DashboardUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardUtilsService]
    });
  });

  it('should be created', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
