import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedSubmissionsComponent } from './received-submissions.component';

describe('ReceivedSubmissionsComponent', () => {
  let component: ReceivedSubmissionsComponent;
  let fixture: ComponentFixture<ReceivedSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivedSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
