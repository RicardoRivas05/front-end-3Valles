import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface DataItem {
  id: number;
  varibaleMedidores: string;
  operacion: number;
} 

@Component({
  selector: 'app-modal-medidor',
  templateUrl: './modal-medidor.component.html',
  styleUrls: ['./modal-medidor.component.css']

})
export class ModalMedidorComponent implements OnInit {
  selectedValue = null;
  
  
  isVisible = false;
  validateForm !: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.CleanForm();
  }
  
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  CleanForm(){
    this.validateForm  = this.fb.group({
      id: [null, [Validators.required]],
      medidorId: [null, [Validators.required]],
      operacion: [null, [Validators.required]],
    });
  }
  
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: DataItem, b: DataItem) => a.id - b.id,
      priority: 2
    },
    {
      title: 'Variable Medidores',
      compare: null,
      priority: false

    },
    {
      title: 'Operacion',
      compare: (a: DataItem, b: DataItem) => a.operacion - b.operacion,
      priority: 2
    },
    
  ];
  listOfData: DataItem[] = [
    {
      id: 123,
      varibaleMedidores: 'jvncsihv',
      operacion: 234
    },
  ];

  

  
}
