import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSadniceComponent } from './dialog-sadnice.component';

describe('DialogSadniceComponent', () => {
  let component: DialogSadniceComponent;
  let fixture: ComponentFixture<DialogSadniceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSadniceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSadniceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
