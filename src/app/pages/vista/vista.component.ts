import { Component, OnInit } from '@angular/core';

interface DataItem {
  grupo: string,
  centroCosto: string
} 

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.css']
})
export class VistaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  listOfColumn = [
    {
      title: 'Grupo',
      compare: null,
      priority: false
    },
    {
      title: 'Centro de costo',
      compare: null,
      priority: false
    },
    
  ];
  listOfData: DataItem[] = [
    {
     grupo: 'Energia',
     centroCosto: 'Turbo X'
    },
  ];

}


