import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarStudentComponent } from './nav-bar-student.component';

describe('NavBarStudentComponent', () => {
  let component: NavBarStudentComponent;
  let fixture: ComponentFixture<NavBarStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBarStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
