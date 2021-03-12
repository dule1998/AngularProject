import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegpoljComponent } from './regpolj.component';

describe('RegpoljComponent', () => {
  let component: RegpoljComponent;
  let fixture: ComponentFixture<RegpoljComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegpoljComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegpoljComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
