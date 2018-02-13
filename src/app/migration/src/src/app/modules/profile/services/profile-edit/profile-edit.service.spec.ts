import { TestBed, inject } from '@angular/core/testing';

import { ProfileEditService } from './profile-edit.service';

describe('ProfileEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileEditService]
    });
  });

  it('should be created', inject([ProfileEditService], (service: ProfileEditService) => {
    expect(service).toBeTruthy();
  }));
});
