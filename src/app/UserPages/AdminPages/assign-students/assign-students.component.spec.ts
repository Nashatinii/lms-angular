import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStudentsComponent } from './assign-students.component';

describe('AssignStudentsComponent', () => {
  let component: AssignStudentsComponent;
  let fixture: ComponentFixture<AssignStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
