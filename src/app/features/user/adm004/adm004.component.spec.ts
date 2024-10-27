import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adm004Component } from './adm004.component';

describe('Adm004Component', () => {
  let component: Adm004Component;
  let fixture: ComponentFixture<Adm004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adm004Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adm004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
