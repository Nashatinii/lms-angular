import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoursInsComponent } from './create-cours-ins.component';

describe('CreateCoursInsComponent', () => {
  let component: CreateCoursInsComponent;
  let fixture: ComponentFixture<CreateCoursInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCoursInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCoursInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
