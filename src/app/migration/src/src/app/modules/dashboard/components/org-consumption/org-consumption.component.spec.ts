import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgConsumptionComponent } from './org-consumption.component';

describe('OrgConsumptionComponent', () => {
  let component: OrgConsumptionComponent;
  let fixture: ComponentFixture<OrgConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
