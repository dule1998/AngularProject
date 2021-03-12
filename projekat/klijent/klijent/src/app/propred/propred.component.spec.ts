import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropredComponent } from './propred.component';

describe('PropredComponent', () => {
  let component: PropredComponent;
  let fixture: ComponentFixture<PropredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
