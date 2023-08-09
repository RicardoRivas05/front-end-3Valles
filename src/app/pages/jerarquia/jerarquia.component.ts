import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JerarquiaService } from 'src/app/servicios/jerarquia.service';
import { JerarquiaModel, vJerarquiaModel, ColumnItem } from '../../modelos/jerarquia';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-jerarquia',
  templateUrl: './jerarquia.component.html',
  styleUrls: ['./jerarquia.component.css']
})
export class JerarquiaComponent implements OnInit {
  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  searchValue = '';
  visible = false;
  accion: string;

  jerarquiaEdit;
  Datajearaquia;


  listofJerarquia: vJerarquiaModel[] = [];
  listOfDisplayData: vJerarquiaModel[] = [];
  listaOfDependencia: vJerarquiaModel[] = [];

  listOfColumns: ColumnItem[] = [
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Dependencia',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.herencia.localeCompare(b.herencia),
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  constructor(
    private fb: FormBuilder,
    private jerarquiaService: JerarquiaService,
    private nzMessageService: NzMessageService
  ) { }

  onExpandChange(id: any, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listofJerarquia.filter((item: vJerarquiaModel) => item.descripcion.indexOf(this.searchValue) !== -1);
  }

  ngOnInit(): void {
    this.accion = 'new';
    this.jerarquiaService.getVJerarquia().toPromise().then(
      (data: vJerarquiaModel[]) => {
        this.listofJerarquia = data;
        this.listOfDisplayData = [...this.listofJerarquia];
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.jerarquiaService.getDependencia().toPromise().then(
      (data: vJerarquiaModel[]) => {
        this.listaOfDependencia = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.limpiar();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.accion = 'new';
    this.limpiar();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  guardar():void {
    //   this.validateForm.value.observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    this.Datajearaquia = {
      ...this.validateForm.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.jerarquiaService.putJerarquia(this.jerarquiaEdit, this.Datajearaquia)
        .toPromise()
        .then((data: vJerarquiaModel) => {
          for (const item of this.listofJerarquia.filter(x => x.id === this.jerarquiaEdit)) {
            item.descripcion = this.Datajearaquia.descripcion;
            item.dependenciaId = this.Datajearaquia.dependenciaId;
            item.estado = this.Datajearaquia.dependenciaId;
            item.herencia = data.herencia;
          }
          this.listOfDisplayData = [...this.listofJerarquia]
          for (const item of this.listaOfDependencia.filter(x => x.id === this.jerarquiaEdit)) {
            item.descripcion = this.Datajearaquia.descripcion;
            item.dependenciaId = this.Datajearaquia.dependenciaId;
            item.estado = this.Datajearaquia.dependenciaId;
            item.herencia = data.herencia;
          }
          this.accion = 'new';
          this.limpiar();
          this.isVisible = false;
          this.nzMessageService.success('El registro fue guardado con éxito');
        },
          (error) => {
            this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
            console.log(error);
            this.limpiar();
            this.accion = 'new';
            this.isVisible = false;
          }
        )
    } else {
      this.jerarquiaService.postJerarquia(this.Datajearaquia)
        .toPromise()
        .then(
          (data: vJerarquiaModel) => {
            this.listofJerarquia = [...this.listofJerarquia, data];
            this.listOfDisplayData = [...this.listofJerarquia];
            this.listaOfDependencia = [...this.listaOfDependencia,data];
            this.nzMessageService.success('El registro fue guardado con éxito');
          },
          (error) => {
            this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
            console.log(error);
            this.limpiar();
          }
        )
    }

    this.isVisible = false;
  }

  editar(data): void {
    this.accion = 'editar';
    this.isVisible = true;

    this.jerarquiaEdit = data.id;
    this.validateForm = this.fb.group({
      descripcion: [data.descripcion, [Validators.required]],
      dependenciaId: [data.dependenciaId]
    });
  }

  eliminar(data): void {
    this.jerarquiaService.deleteJerarquia(data.id, { estado: false })
      .toPromise()
      .then(() => {
        this.nzMessageService.success('El registro fue eliminado con éxito');
        this.listofJerarquia = this.listofJerarquia.filter(x => x.id !== data.id);
        this.listOfDisplayData = [...this.listofJerarquia];
      }, (error) => {
        this.nzMessageService.warning('El registro no pudo ser eleminado, por favor intente de nuevo o contactese con su administrador');
        console.log(error);
      })
  }

  cancel(): void {
    this.nzMessageService.info('Su registro sigue activo');
  }

  limpiar() {
    this.validateForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      dependenciaId: [null],
    });
  }

}
