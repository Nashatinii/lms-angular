import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarInsComponent } from './navbar-ins.component';

describe('NavbarInsComponent', () => {
  let component: NavbarInsComponent;
  let fixture: ComponentFixture<NavbarInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
