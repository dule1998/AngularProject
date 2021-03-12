import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegprivrComponent } from './regprivr.component';

describe('RegprivrComponent', () => {
  let component: RegprivrComponent;
  let fixture: ComponentFixture<RegprivrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegprivrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegprivrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
