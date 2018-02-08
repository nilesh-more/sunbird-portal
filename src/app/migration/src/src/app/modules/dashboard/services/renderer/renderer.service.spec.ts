import { TestBed, inject } from '@angular/core/testing';

import { RendererService } from './renderer.service';

describe('RendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RendererService]
    });
  });

  it('should be created', inject([RendererService], (service: RendererService) => {
    expect(service).toBeTruthy();
  }));
});
