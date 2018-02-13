import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileVisibilityComponent } from './profile-visibility.component';

describe('ProfileVisibilityComponent', () => {
  let component: ProfileVisibilityComponent;
  let fixture: ComponentFixture<ProfileVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileVisibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
