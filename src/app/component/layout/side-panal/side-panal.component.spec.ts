import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanalComponent } from './side-panal.component';

describe('SidePanalComponent', () => {
  let component: SidePanalComponent;
  let fixture: ComponentFixture<SidePanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePanalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
