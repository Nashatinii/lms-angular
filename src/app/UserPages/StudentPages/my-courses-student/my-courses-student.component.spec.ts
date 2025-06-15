import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCoursesStudentComponent } from './my-courses-student.component';

describe('MyCoursesStudentComponent', () => {
  let component: MyCoursesStudentComponent;
  let fixture: ComponentFixture<MyCoursesStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyCoursesStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCoursesStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
