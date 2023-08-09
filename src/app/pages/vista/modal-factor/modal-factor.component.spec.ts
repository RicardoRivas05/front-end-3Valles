import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFactorComponent } from './modal-factor.component';

describe('ModalFactorComponent', () => {
  let component: ModalFactorComponent;
  let fixture: ComponentFixture<ModalFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
