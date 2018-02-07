import { TestBed, inject } from '@angular/core/testing';
import { DataService } from './data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService, HttpClientModule, HttpClient]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
