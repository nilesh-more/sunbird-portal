import { TestBed, inject } from '@angular/core/testing';

import { OrgCreationService } from './org-creation.service';

describe('OrgCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgCreationService]
    });
  });

  it('should be created', inject([OrgCreationService], (service: OrgCreationService) => {
    expect(service).toBeTruthy();
  }));
});
