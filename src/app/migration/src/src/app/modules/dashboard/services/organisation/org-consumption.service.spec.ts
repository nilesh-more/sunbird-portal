import { TestBed, inject } from '@angular/core/testing';

import { OrgConsumptionService } from './org-consumption.service';

describe('OrgConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgConsumptionService]
    });
  });

  it('should be created', inject([OrgConsumptionService], (service: OrgConsumptionService) => {
    expect(service).toBeTruthy();
  }));
});
