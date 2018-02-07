// Import NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import modules
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { ChartsModule } from 'ng2-charts';

// Import services
import { OrganisationComponent } from './organisation.component';
import { OrganisationService } from '../../dashboard/datasource/organisation.service';
import { DownloadService } from '../../dashboard/datasource/download.service';
import { RendererService } from '../../dashboard/renderer/renderer.service';
import { ResourceService } from '../../services/resource/resource.service';
import { UserService } from '../../services/user/user.service';

describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationComponent ]
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
});
