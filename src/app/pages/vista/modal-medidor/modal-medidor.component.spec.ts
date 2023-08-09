import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMedidorComponent } from './modal-medidor.component';

describe('ModalMedidorComponent', () => {
  let component: ModalMedidorComponent;
  let fixture: ComponentFixture<ModalMedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMedidorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
