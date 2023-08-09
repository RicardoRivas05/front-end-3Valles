import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { grupoModel, ColumnItem } from 'src/app/modelos/grupo';
import { grupoService } from 'src/app/servicios/grupo.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  listOfDisplayData: any[];
  listofGrupos:any[];
  visible: boolean=false;
  isVisibleFactor:boolean =false;
  searchValue = '';
  validateForm: FormGroup;
  grupoId:number;

  listOfColumns: ColumnItem[] = [
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.nombre.localeCompare(b.nombre),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Centro de Costo',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.centroCostoId-b.centroCostoId,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Factor',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.factorId - b.factorId,
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  constructor(
    private fb: FormBuilder,
    private grupoService:grupoService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.grupoService.getGrupoRelation().toPromise().then(
      (data:any[])=>{
        this.listofGrupos = data;
        this.listOfDisplayData = [...this.listofGrupos];
      },
      (error)=>{
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    )
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listofGrupos.filter((item: grupoModel) => item.nombre.indexOf(this.searchValue) !== -1);
  }

  handleCancelFactor(): void {
    this.isVisibleFactor = false;
    this.limpiar();
  }

  
  limpiar() {
    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      descripcion: [''],
      fechaInicial: [null],
      fechaFinal: [null],
      valor: [0]
    });
  }


  submitFormFactor(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  showModalFactor(data): void {
    this.grupoId=data.id;
    this.isVisibleFactor=true
    this.validateForm = this.fb.group({
      id: [data.factorId, [Validators.required]],
      valor: [data.factor.valor]
    })
  }

  guardarFactor(){
    this.grupoService.patchFactor(this.validateForm.value.id,{"valor":this.validateForm.value.valor+""})
    .toPromise()
        .then(() => {
          for (const item of this.listofGrupos.filter(x => x.id === this.grupoId)) {
            item.factor.valor = this.validateForm.value.valor
          }
          this.limpiar();
          this.isVisibleFactor = false;
          this.nzMessageService.success('El registro fue guardado con éxito');
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
          this.limpiar();
          this.isVisibleFactor= false;
        })
  }
}
