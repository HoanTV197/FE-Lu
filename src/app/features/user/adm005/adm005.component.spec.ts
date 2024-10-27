import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adm005Component } from './adm005.component';

describe('Adm005Component', () => {
  let component: Adm005Component;
  let fixture: ComponentFixture<Adm005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adm005Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adm005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
