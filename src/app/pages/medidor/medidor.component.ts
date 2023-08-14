import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MedidorService } from 'src/app/servicios/medidores.service';
import { MedidorModel, ColumnItem, PMEMedidorModel, RolloverModel, variableModel } from '../../modelos/medidor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { DatosService } from 'src/app/servicios/datos.service';


@Component({
  selector: 'app-medidor',
  templateUrl: './medidor.component.html',
  styleUrls: ['./medidor.component.css']
})
export class MedidorComponent implements OnInit {
  expandSet = new Set<any>();
  isVisible = false;
  isVisibleRollover = false;
  isVisibleVariable = false;
  isVisibleData = false;
  isVisibleQuantity = false;
  isVisibleTipo = false;
  validateForm: FormGroup;
  validateFormRollover: FormGroup;
  validateFormVariable: FormGroup;
  validateFormData: FormGroup;
  searchValue = '';
  visible = false;
  accion: string;
  permiso: any;
  idMedidor
  idRollover;
  idVariable;
  idDatos;
  codigoMedidor;
  medidorEdit;
  dataMedidor;
  pipe = new DatePipe('en-US');

  listofMedidor: MedidorModel[] = [];
  listOfDisplayData: MedidorModel[] = [];
  listOfPME: any[] = [];
  listOfPME2: any[] = [];
  listOfVariable: any[] = [];
  listOfVariablePME: variableModel[] = [];
  listOfDataRolloverMedidor: RolloverModel[] = [];
  listOfDatosManuales: any[] = [];

  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.sourceId - b.sourceId,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Tipo',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.tipo - b.tipo,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Disponible',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.estado - b.estado,
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  constructor(
    private fb: FormBuilder,
    private medidorService: MedidorService,
    private datosService: DatosService,
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

  submitFormRollover(): void {
    for (const i in this.validateFormRollover.controls) {
      this.validateFormRollover.controls[i].markAsDirty();
      this.validateFormRollover.controls[i].updateValueAndValidity();
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listofMedidor.filter((item: MedidorModel) => item.descripcion.indexOf(this.searchValue) !== -1);
  }

  ngOnInit(): void {
    this.accion = 'new';
    this.medidorService.getMedidor().toPromise().then(
      (data: MedidorModel[]) => {
        this.listofMedidor = data;
        this.listOfDisplayData = [...this.listofMedidor];
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.medidorService.getMedidorPME().toPromise().then(
      (data: PMEMedidorModel[]) => this.listOfPME = data,
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.limpiar();
    this.limpiarRollover();
    this.limpiarVariables();
    this.limpiarData();
  }

  showModal(): void {
    this.isVisible = true;
    this.isVisibleTipo = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.accion = 'new';
    this.limpiar();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  guardar(): void {
    this.dataMedidor = {
      sourceId: (this.validateForm.value.sourceId === null || this.validateForm.value.sourceId === undefined) ? 0 : this.validateForm.value.sourceId,
      descripcion: (this.validateForm.value.descripcion === '' || this.validateForm.value.descripcion === undefined) ? 'N/A' : this.validateForm.value.descripcion,
      lecturaMax: (this.validateForm.value.lecturaMax === null || this.validateForm.value.lecturaMax === undefined) ? '0' : this.validateForm.value.lecturaMax + '',
      multiplicador: (this.validateForm.value.multiplicador === null || this.validateForm.value.multiplicador === undefined) ? '1' : this.validateForm.value.multiplicador + '',
      observacion: (this.validateForm.value.observacion === null || this.validateForm.value.observacion === '' || this.validateForm.value.observacion === undefined) ? 'N/A' : this.validateForm.value.observacion,
      tipo: (this.validateForm.value.tipo === 'true') ? true : false,
      estado: true
    }

    if (this.accion === 'editar') {
      this.medidorService.putMedidor(this.medidorEdit, this.dataMedidor)
        .toPromise()
        .then((data: MedidorModel) => {
          for (const item of this.listofMedidor.filter(x => x.id === this.medidorEdit)) {
            item.sourceId = this.dataMedidor.sourceId;
            item.descripcion = this.dataMedidor.descripcion;
            item.lecturaMax = this.dataMedidor.lecturaMax;
            item.multiplicador = this.dataMedidor.multiplicador;
            item.observacion = this.dataMedidor.observacion;
            item.tipo = this.dataMedidor.tipo;
            item.estado = this.dataMedidor.estado;
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
      this.medidorService.postMedidor(this.dataMedidor)
        .toPromise()
        .then((data: MedidorModel) => {
          this.listofMedidor = [...this.listofMedidor, data];
          this.listOfDisplayData = [...this.listofMedidor];
          this.nzMessageService.success('El registro fue guardado con éxito');
          this.limpiar();
          this.accion = 'new';
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
    this.isVisibleTipo = data.tipo;
    this.accion = 'editar';
    this.isVisible = true;
    this.medidorEdit = data.id;
    this.validateForm = this.fb.group({
      sourceId: [data.sourceId, [Validators.required]],
      descripcion: [data.descripcion],
      lecturaMax: [data.lecturaMax],
      multiplicador: [data.multiplicador],
      observacion: [data.observacion],
      tipo: [(data.tipo === false) ? 'false' : 'true']
    })
  }

  eliminar(data): void {
    this.medidorService.deleteMedidor(data.id, { estado: false })
      .toPromise()
      .then(() => {
        this.nzMessageService.success('El registro fue eliminado con éxito');
        this.listofMedidor = this.listofMedidor.filter(x => x.id !== data.id);
        this.listOfDisplayData = [...this.listofMedidor];
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
      sourceId: [null, [Validators.required]],
      descripcion: [''],
      lecturaMax: [null],
      multiplicador: [null],
      observacion: [''],
      tipo: ['true']
    });
  }

  changeTipo(index) {
    this.isVisibleTipo = index === "true" ? true : false;
  }

  //ROLLOVER

  showModalRollover(data): void {
    this.isVisibleRollover = true;
    this.codigoMedidor = data.sourceId + ' - ' + data.descripcion;
    this.idMedidor = data.id;

    this.medidorService.getVariableMedidorRollover(this.idMedidor).toPromise().then(
      (data: any) => {
        this.listOfDataRolloverMedidor = [];
        data.forEach(item => {
          if (item.rollOvers) {
            item.rollOvers.forEach(element => {
              this.listOfDataRolloverMedidor.push(element)
            });
          }
        });
      },
      (error) => {
        this.listOfDataRolloverMedidor = [];
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.medidorService.getVariablesPME(this.idMedidor).toPromise().then(
      (data: variableModel[]) => {
        this.listOfVariable = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );
  }

  handleCancelRollover(): void {
    this.accion = 'new';
    this.isVisibleRollover = false;
    this.limpiarRollover();
  }

  handleOkRollover(): void {
    this.limpiarRollover()
    this.isVisibleRollover = false;
  }

  limpiarRollover() {
    this.validateFormRollover = this.fb.group({
      fecha: [null, [Validators.required]],
      variableMedidorId: [null, [Validators.required]],
      lecturaAnterior: [0, [Validators.required]],
      lecturaNueva: [0, [Validators.required]],
      observacion: ['']
    });
  }

  guardarRollover() {
    // tslint:disable-next-line: max-line-length
    const observacion = (this.validateFormRollover.value.observacion === '' || this.validateFormRollover.value.observacion === null) ? 'N/A' : this.validateFormRollover.value.observacion;
    // this.validateForm.value.fecha = moment(this.validateForm.value.fecha).format('YYYY-MM-DD HH:mm:ss')
    const myFormattedDate = this.pipe.transform(this.validateFormRollover.value.fecha, 'yyyy-MM-dd HH:mm', '-1200');

    const dataRollover = {
      fecha: (new Date(myFormattedDate)).toISOString(),
      variableMedidorId: this.validateFormRollover.value.variableMedidorId,
      lecturaAnterior: `${this.validateFormRollover.value.lecturaAnterior}`,
      lecturaNueva: `${this.validateFormRollover.value.lecturaNueva}`,
      observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.medidorService
        .putRollover(this.idRollover, dataRollover)
        .toPromise()
        .then(
          () => {
            for (const item of this.listOfDataRolloverMedidor.filter(x => x.id === this.idRollover)) {
              item.fecha = dataRollover.fecha;
              item.variableMedidorId = dataRollover.variableMedidorId;
              item.lecturaAnterior = dataRollover.lecturaAnterior;
              item.lecturaNueva = dataRollover.lecturaNueva;
              item.observacion = dataRollover.observacion;
            }
            this.accion = 'new';
            this.limpiarRollover();
            this.isVisible = false;
            this.nzMessageService.success('El registro fue guardado con éxito');
          }, (error) => {
            this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
            console.log(error);
            this.limpiarRollover();
            this.accion = 'new';
            this.isVisible = false;
          }
        )
    } else {
      this.medidorService.postRollover(dataRollover).toPromise().then(
        (data: RolloverModel) => {
          this.listOfDataRolloverMedidor = [...this.listOfDataRolloverMedidor, data];
          this.nzMessageService.success('El registro fue guardado con éxito');
          this.limpiarRollover();
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
          this.limpiarRollover();
        }
      )
    }
  }

  editarRollover(data) {
    this.idRollover = data.id;
    this.accion = 'editar';
    const myFormattedDate = this.pipe.transform(data.fecha, 'yyyy-MM-dd HH:mm', '+0000');

    this.validateFormRollover = this.fb.group({
      fecha: [myFormattedDate, [Validators.required]],
      variableMedidorId: [data.variableMedidorId],
      lecturaAnterior: [data.lecturaAnterior],
      lecturaNueva: [data.lecturaNueva],
      observacion: [data.observacion]
    });
  }

  eliminarRollover(data) {
    this.medidorService.deleteRollover(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.nzMessageService.success('El registro fue eliminado con éxito');
          this.listOfDataRolloverMedidor = this.listOfDataRolloverMedidor.filter(x => x.id !== data.id);
          //  this.listOfDataRollover = this.listOfDataRollover.filter(x => x.id !== data.id);
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser eleminado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
        }
      );
  }

  //Variables
  showModalVariable(data): void {
    this.isVisibleVariable = true;
    this.idMedidor = data.id;
    this.isVisibleQuantity = data.tipo;

    this.medidorService.getVariable().toPromise().then(
      (data: variableModel[]) => {
        this.listOfVariable = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.medidorService.getVariablePME().toPromise().then(
      (data: variableModel[]) => {
        this.listOfVariablePME = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );

    this.medidorService.getVariablesPME(this.idMedidor).toPromise().then(
      (data: variableModel[]) => {
        this.listOfPME2 = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );
  }

  handleCancelVariables(): void {
    this.accion = 'new';
    this.isVisibleVariable = false;
    this.limpiarVariables();
  }

  handleOkVariables(): void {
    this.limpiarVariables()
    this.isVisibleVariable = false;
  }

  limpiarVariables() {
    this.validateFormVariable = this.fb.group({
      variableId: [null, [Validators.required]],
      quantityId: [null, [Validators.required]]
    });
  }

  guardarVariables() {
    const dataVariable = {
      medidorId: this.idMedidor,
      variableId: this.validateFormVariable.value.variableId,
      quantityId: this.isVisibleQuantity === true ? this.validateFormVariable.value.quantityId : 0,
      estado: true
    }

    if (this.accion === 'editar') {
      this.medidorService
        .putVariable(this.idVariable, dataVariable)
        .toPromise()
        .then(
          (datar: any) => {
            for (const item of this.listOfPME2.filter(x => x.id === this.idVariable)) {
              item.id = datar.id;
              item.variableMedidorId = datar.variableMedidorId;
              item.medidorId = datar.medidorId;
              item.quantityId = datar.quantityId;
              item.name = datar.name;
              item.variableId = datar.variableId;
              item.descripcion = datar.descripcion;
            }
            this.accion = 'new';
            this.limpiarVariables();
            this.isVisible = false;
            this.nzMessageService.success('El registro fue guardado con éxito');
          }, (error) => {
            this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
            console.log(error);
            this.limpiarVariables();
            this.accion = 'new';
            this.isVisible = false;
          }
        )
    } else {
      this.medidorService.postVariable(dataVariable).toPromise().then(
        (data) => {
          this.listOfPME2 = [...this.listOfPME2, data];
          this.nzMessageService.success('El registro fue guardado con éxito');
          this.limpiarVariables();
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
          this.limpiarVariables();
        }
      )
    }
  }

  editarVariables(data) {
    this.idVariable = data.id;
    this.accion = 'editar';

    this.validateFormVariable = this.fb.group({
      variableId: [data.variableId, [Validators.required]],
      quantityId: [data.quantityId, [Validators.required]],
    });
  }

  eliminarVariables(data) {
    this.medidorService.deleteVariable(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.nzMessageService.success('El registro fue eliminado con éxito');
          this.listOfPME2 = this.listOfPME2.filter(x => x.id !== data.id);
          //  this.listOfDataRollover = this.listOfDataRollover.filter(x => x.id !== data.id);
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser eleminado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
        }
      );
  }

  submitFormVariable(): void {
    for (const i in this.validateFormVariable.controls) {
      this.validateFormVariable.controls[i].markAsDirty();
      this.validateFormVariable.controls[i].updateValueAndValidity();
    }
  }

  //DATA
  limpiarData() {
    this.validateFormData = this.fb.group({
      variableId: [null, [Validators.required]],
      fecha: [null, [Validators.required]],
      lectura: [null, [Validators.required]]
    });
  }

  submitFormData(): void {
    for (const i in this.validateFormData.controls) {
      this.validateFormData.controls[i].markAsDirty();
      this.validateFormData.controls[i].updateValueAndValidity();
    }
  }

  showModalData(data): void {
    this.isVisibleData = true;
    this.idMedidor = data.id;

    this.medidorService.getVariablesPME(this.idMedidor).toPromise().then(
      (data: variableModel[]) => {
        this.listOfVariable = data.map((x)=> {return {"variableId":x.id, "descripcion":x.descripcion}});

        this.datosService.getDatosId(String(data.map((x) => x.id))).toPromise().then(
          (data: any[]) => {
            let dataM= data.map((x)=>{
              return {...x,"fecha":this.pipe.transform(x.fecha, 'yyyy-MM-dd HH:mm', '-0000')}
            })
            this.listOfDatosManuales = dataM
          }
        )
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );
    /*     this.idMedidor = data.id;

         this.medidorService.getVariable().toPromise().then(
           (data: variableModel[]) => {
             this.listOfVariable = data;
           },
           (error) => {
             this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
             console.log(error);
           }
         );

         this.medidorService.getVariablePME().toPromise().then(
           (data: variableModel[]) => {
             this.listOfVariablePME = data;
           },
           (error) => {
             this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
             console.log(error);
           }
         );

         this.medidorService.getVariablesPME(this.idMedidor).toPromise().then(
           (data: variableModel[]) => {
             this.listOfPME2 = data;
           },
           (error) => {
             this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
             console.log(error);
           }
         );*/
  }

  handleCancelData(): void {
    this.accion = 'new';
    this.isVisibleData = false;
    this.limpiarData();
  }

  handleOkData(): void {
    this.limpiarData()
    this.isVisibleData = false;
  }

  guardarData() {
    const myFormattedDate = this.pipe.transform(this.validateFormData.value.fecha, 'yyyy-MM-dd HH:mm', '-1200');
    const dataManual = {
      variableId: this.validateFormData.value.variableId,
      fecha: (new Date(myFormattedDate)).toISOString(),
      lectura: this.validateFormData.value.lectura,
      estado: true
    }

    if (this.accion === 'editar') {
      this.datosService
      .putDatos(this.idDatos, dataManual)
      .toPromise()
      .then(
        () => {
          for (const item of this.listOfDatosManuales.filter(x => x.id === this.idDatos)) {
            item.id = this.idDatos;
            item.variableId = dataManual.variableId;
            item.fecha = this.pipe.transform(dataManual.fecha, 'yyyy-MM-dd HH:mm', '-0000');
            item.lectura = dataManual.lectura;
            item.estado = dataManual.estado;
          }
          this.accion = 'new';
          this.limpiarData();
          this.isVisible = false;
          this.nzMessageService.success('El registro fue guardado con éxito');
        }, (error) => {
          this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
          this.limpiarData();
          this.accion = 'new';
          this.isVisible = false;
        }
      )
    } else {
      this.datosService.postDatos(dataManual).toPromise().then(
        (data) => {
          this.listOfDatosManuales = [...this.listOfDatosManuales, {...data, "fecha":this.pipe.transform(dataManual.fecha, 'yyyy-MM-dd HH:mm', '-0000')}];
          this.nzMessageService.success('El registro fue guardado con éxito');
          this.limpiarData();
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
          this.limpiarData();
        }
      )
    }

  }

  editarDatos(data) {
    this.idDatos = data.id;
    this.accion = 'editar';

    this.validateFormData = this.fb.group({
      variableId: [data.variableId, [Validators.required]],
      fecha: [data.fecha, [Validators.required]],
      lectura: [data.lectura, [Validators.required]]
    });
  }

  eliminarDatos(data) {
    this.datosService.deleteDatos(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.nzMessageService.success('El registro fue eliminado con éxito');
          this.listOfDatosManuales = this.listOfDatosManuales.filter(x => x.id !== data.id);
          //  this.listOfDataRollover = this.listOfDataRollover.filter(x => x.id !== data.id);
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser eleminado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
        }
      );
  }
}
