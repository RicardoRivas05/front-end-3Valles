import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EntidadModel, ColumnItem } from 'src/app/modelos/entidad';
import { EntidadService } from 'src/app/servicios/entidad.service';
import { MedidorService } from 'src/app/servicios/medidores.service';
import { JerarquiaService } from 'src/app/servicios/jerarquia.service';
import {TransformacionesService} from 'src/app/servicios/transformaciones.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MedidorEntidadModel } from '../../modelos/entidad';
import { JerarquiaModel } from '../../modelos/jerarquia';
import { variableModel } from '../../modelos/medidor';
import { DatePipe } from '@angular/common';
import { Transformaciones, TransformacionesView } from 'src/app/modelos/transformaciones';
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-consumidores',
  templateUrl: './consumidores.component.html',
  styleUrls: ['./consumidores.component.css']
})
export class ConsumidoresComponent implements OnInit {
  pipe = new DatePipe('en-US');
  expandSet = new Set<any>();
  isVisible = false;
  isVisibleTransformacion = false;
  visibleDrawer = false;
  visibleEditarButton = false;
  loadingEditarButton = false;

  validateForm: FormGroup;
  validateFormMedidores: FormGroup;
  searchValue = '';
  visible = false;

  accion: string;
  accionMedidor: string;
  accionTransformacion: string;
  idMedidor: number;

  entradaEdit;
  medidorEdit;
  dataEntrada;
  dataMedidor;

  listofEntidad: EntidadModel[] = [];
  listOfDisplayData: EntidadModel[] = [];
  listofMedidor: MedidorEntidadModel[] = [];
  listofJerarquia: JerarquiaModel[] = [];
  listofVariableMedidor: variableModel[] = [];

  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.codigo.localeCompare(b.codigo),
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
    }
  ];
  selectTransformadores: EntidadModel [] = [];
  selectProveedores: EntidadModel [] = [];
  selectedMedidor: EntidadModel;
  TransformacionesForm: FormGroup = new FormGroup({
    CodigoMedidor: new FormControl(null),
    ProveedorEnergia: new FormControl(null),
    NumeroTransformacion: new FormControl(null),
    Transformador: new FormControl(null),
    Observacion: new FormControl(null,)
  });

  visibleTransformacionesTable: Boolean = false;
  loadingTransformacionesTable: Boolean = false;
  transformacionesTableData: TransformacionesView[] = [];
  loadingButtonPostTransformaciones: Boolean = false;
  numeroTransformacion: Number = 1;
  selectedTransformacion: TransformacionesView;
  constructor(
    private fb: FormBuilder,
    private entidadService: EntidadService,
    private jerarquiaService: JerarquiaService,
    private medidorService: MedidorService,
    private nzMessageService: NzMessageService,
    private transformacionesService: TransformacionesService
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
    this.listOfDisplayData = this.listofEntidad.filter((item: EntidadModel) => item.codigo.indexOf(this.searchValue) !== -1);
  }

  ngOnInit(): void {
    this.accion = 'new';
    this.entidadService.getEntidad(0).toPromise().then(
      (data: EntidadModel[]) => {
        this.listofEntidad = data;
        this.listOfDisplayData = [...this.listofEntidad];
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    );
    this.limpiar();
    this.limpiarMedidor();
    this.limpiarTransformacion();
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

  guardar(): void {
    const observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    this.dataEntrada = {
      codigo: this.validateForm.value.codigo,
      descripcion: this.validateForm.value.descripcion,
      tipo: (this.validateForm.value.tipo === 'true') ? true : false,
      entidad: 0,
      observacion: observacion,
      estado: true
    }

    if (this.accion === 'editar') {
      this.entidadService.putEntidad(this.entradaEdit, this.dataEntrada)
        .toPromise()
        .then((data: EntidadModel) => {
          for (const item of this.listofEntidad.filter(x => x.id === this.entradaEdit)) {
            item.codigo = this.dataEntrada.codigo;
            item.descripcion = this.dataEntrada.descripcion;
            item.tipo = this.dataEntrada.tipo;
            item.observacion = this.dataEntrada.observacion;
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
      this.entidadService.postEntidad(this.dataEntrada)
        .toPromise()
        .then(
          (data: EntidadModel) => {
            this.listofEntidad = [...this.listofEntidad, data];
            this.listOfDisplayData = [...this.listofEntidad];
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

    this.entradaEdit = data.id;
    this.validateForm = this.fb.group({
      codigo: [data.codigo, [Validators.required]],
      descripcion: [data.descripcion],
      tipo: [(data.tipo === false) ? 'false' : 'true'],
      observacion: [data.observacion]
    })
  }


  eliminar(data): void {
    this.entidadService.deleteEntidad(data.id, { estado: false })
      .toPromise()
      .then(() => {
        this.nzMessageService.success('El registro fue eliminado con éxito');
        this.listofEntidad = this.listofEntidad.filter(x => x.id !== data.id);
        this.listOfDisplayData = [...this.listofEntidad];
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
      codigo: ['', [Validators.required]],
      descripcion: [''],
      tipo: ['false'],
      observacion: ['']
    });
  }

  //ASIGNACION MEDIDORES
  open(data): void {
    this.visibleDrawer = true;
    this.idMedidor = data.id;

    this.entidadService.getMedidorEntidad(this.idMedidor).toPromise().then(
      (data: MedidorEntidadModel[]) => {
        this.listofMedidor = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    )

    this.jerarquiaService.getJerarquia().toPromise().then(
      (data: JerarquiaModel[]) => {
        this.listofJerarquia = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    )

    this.medidorService.getAllVariablesPME().toPromise().then(
      (data: variableModel[]) => {
        this.listofVariableMedidor = data;
      },
      (error) => {
        this.nzMessageService.warning('No se pudo conectar al servidor, revise su conexión a internet o comuníquese con el proveedor.');
        console.log(error);
      }
    )


  }

  close(): void {
    this.visibleDrawer = false;
  }

  editarMedidor(data) {
    this.selectedMedidor = data;
    this.accion = 'editar';
    const F1 = this.pipe.transform(data.fechaInicial, 'yyyy-MM-dd HH:mm', '+0000');
    const F2 = this.pipe.transform(data.fechaFinal, 'yyyy-MM-dd HH:mm', '+0000');
    this.medidorEdit=data.id

    this.validateFormMedidores = this.fb.group({
      variableMedidorId: [data.variableMedidorId, [Validators.required]],
      jerarquiaId: [data.jerarquiaId, [Validators.required]],
      fecha: [[F1, F2]],
      observacion: [data.observacion],
    })

  }

  eliminarMedidor(data) { 
    this.entidadService.deleteMedidorEntidad(data.id, { estado: false }).toPromise().then(
      ()=>{
        this.nzMessageService.success('El registro fue eliminado con éxito');
        this.listofMedidor = this.listofMedidor.filter(x => x.id !== data.id);
      }, (error) => {
        this.nzMessageService.warning('El registro no pudo ser eleminado, por favor intente de nuevo o contactese con su administrador');
        console.log(error);
      }
    )
  }

  handleCancelMedidor(): void {
    this.visibleDrawer = false;
    this.accionMedidor = 'new';
    this.limpiarMedidor();
  }

  limpiarMedidor(): void {
    this.validateFormMedidores = this.fb.group({
      variableMedidorId: [null, [Validators.required]],
      jerarquiaId: [null, [Validators.required]],
      fecha: [null],
      observacion: ['']
    });
  }

  handleOkMedidor(): void {
    this.visibleDrawer = false;
  }

  guardarMedidor():void{
    const observacion = (this.validateFormMedidores.value.observacion === '' || this.validateFormMedidores.value.observacion === null) ? 'N/A' : this.validateFormMedidores.value.observacion;
    const F1 = this.pipe.transform(this.validateFormMedidores.value.fecha[0], 'yyyy-MM-dd HH:mm', '-1200');
    const F2 = this.pipe.transform(this.validateFormMedidores.value.fecha[1], 'yyyy-MM-dd HH:mm', '-1200');

    this.dataMedidor = {
      variableMedidorId: this.validateFormMedidores.value.variableMedidorId,
      entidadId: this.idMedidor,
      fechaInicial: new Date(F1).toISOString(),
      fechaFinal: new Date(F2).toISOString(),
      jerarquiaId: this.validateFormMedidores.value.jerarquiaId,
      observacion,
      estado: true
    }

    if (this.accion === 'editar') {
      this.entidadService.putMedidorEntidad(this.medidorEdit,this.dataMedidor).toPromise().then(
        (data:MedidorEntidadModel)=>{
         this.listofMedidor[this.listofMedidor.map(x=>x.id).indexOf(this.medidorEdit)] = data
         
          this.accion = 'new';
          this.limpiarMedidor();
          this.isVisible = false;
          this.nzMessageService.success('El registro fue guardado con éxito');
          this.handleOkMedidor()
        },
          (error) => {
            this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
            console.log(error);
            this.limpiarMedidor();
            this.accion = 'new';
            this.isVisible = false;
          }
          
      )
    }else{
      this.entidadService.postMedidorEntidad(this.dataMedidor)
      .toPromise()
      .then(
        (data:MedidorEntidadModel) => {
          this.listofMedidor = [...this.listofMedidor, data];
          this.nzMessageService.success('El registro fue guardado con éxito');
          this.limpiarMedidor();
        },
        (error) => {
          this.nzMessageService.warning('El registro no pudo ser guardado, por favor intente de nuevo o contactese con su administrador');
          console.log(error);
          this.limpiarMedidor();
        }
      )
    }
  }

  submitFormMedidores(){
    for (const i in this.validateFormMedidores.controls) {
      this.validateFormMedidores.controls[i].markAsDirty();
      this.validateFormMedidores.controls[i].updateValueAndValidity();
    }
  }

  //TRANSFORMACIONES
  handleCancelTransformacion(): void {
    this.isVisibleTransformacion = false;
    this.transformacionesTableData = [];
    this.numeroTransformacion = 1;
    this.limpiarTransformacion();
  }

  async handleGuardarTransformacion(): Promise<void> {
      this.loadingButtonPostTransformaciones = true;
      const nextTransformacion = this.numeroTransformacion.valueOf() + 1;
      const tranformacionObject ={
        clienteId: this.idMedidor,
        proveedorId: this.TransformacionesForm.get('ProveedorEnergia').value,
        transformadorId: this.TransformacionesForm.get('Transformador').value,
        numeroTransf: nextTransformacion,
        fechaInicial: moment().toISOString(true),
        fechaFinal: moment().toISOString(true),
        observacion: this.TransformacionesForm.get('Observacion').value,
        estado: true
      }
      try {
        const result = await this.transformacionesService.postTransformaciones(tranformacionObject).toPromise();
        const newObject = this.transformacionesService.createViewObject(result,this.selectTransformadores,this.selectProveedores);
        this.transformacionesTableData = [...this.transformacionesTableData,newObject];
        let indexOfDelete = this.numeroTransformacion.valueOf() - 1;
        this.transformacionesTableData[indexOfDelete].canDelete = false;
        this.numeroTransformacion = result.numeroTransf;
        indexOfDelete = this.numeroTransformacion.valueOf() - 1;
        this.transformacionesTableData[indexOfDelete].canDelete = true;
        this.TransformacionesForm.get('NumeroTransformacion').setValue(this.numeroTransformacion);
        this.TransformacionesForm.get('Observacion').setValue('');
      } catch (error) {
        this.nzMessageService.error('Ha occurido un error inesperado');
        console.error(error);
      }
      this.loadingButtonPostTransformaciones = false;
  }

  limpiarTransformacion(): void {
    this.TransformacionesForm.reset();
  }

  async showModalTransformacion(): Promise<void>{
    this.isVisibleTransformacion = true;
    const transformadores = await this.entidadService.getEntidad(2).toPromise();
    const proveedores = await this.entidadService.getEntidad(1).toPromise();
    this.selectTransformadores = transformadores;
    this.selectProveedores = proveedores;
  }

  async handleShowTableTransformacion(): Promise<void>{
    if(this.TransformacionesForm.get('Transformador').value && this.TransformacionesForm.get('ProveedorEnergia').value){
      this.transformacionesTableData = [];
      this.visibleTransformacionesTable = true;
      this.loadingTransformacionesTable = true;
      const transformaciones = await this.transformacionesService.getTransformacionesById(this.idMedidor,this.TransformacionesForm.get('Transformador').value,this.TransformacionesForm.get('ProveedorEnergia').value).toPromise()
      this.numeroTransformacion = this.transformacionesService.handleNumeroTransformacion(transformaciones);
      this.TransformacionesForm.get('NumeroTransformacion').setValue(this.numeroTransformacion);
      transformaciones.forEach((tranf)=>{
          this.transformacionesTableData = 
            [
              ...this.transformacionesTableData,
              this.transformacionesService.createViewObject(tranf,this.selectTransformadores,this.selectProveedores)
            ]
      });
      
      const indexOfDelete = this.numeroTransformacion.valueOf() - 1;
      this.transformacionesTableData[indexOfDelete].canDelete = true
      console.log(this.transformacionesTableData);
      this.loadingTransformacionesTable = false;
    }else{
      this.visibleTransformacionesTable = false;
    }
  }

  editarTransformacion(data) { 
    this.selectedTransformacion = data;
    this.TransformacionesForm.get('Observacion').setValue(data.observacion)
    this.TransformacionesForm.get('NumeroTransformacion').setValue(data.numeroTransf);
    this.visibleEditarButton = true;
  }

  handleCancelEditar() {
    this.selectedTransformacion = null;
    this.TransformacionesForm.get('Observacion').setValue('');
    this.TransformacionesForm.get('NumeroTransformacion').setValue(this.numeroTransformacion);
    this.visibleEditarButton = false;
  }

  async handleEditTransformacion(){
    this.loadingEditarButton = true;
    
    const tranformacionObject ={
      clienteId: this.idMedidor,
      proveedorId: this.selectedTransformacion.proveedor.id,
      transformadorId: this.selectedTransformacion.transformador.id,
      numeroTransf: this.selectedTransformacion.numeroTransf,
      fechaInicial: moment().toISOString(true),
      fechaFinal: moment().toISOString(true),
      observacion: this.TransformacionesForm.get('Observacion').value,
      estado: true
    }
    try {
      await this.transformacionesService.putTransformaciones(this.selectedTransformacion.id,tranformacionObject).toPromise();
      this.nzMessageService.success("Registro modificado");
    }catch (error){
      console.log(error);
    }
    this.TransformacionesForm.get('Observacion').setValue('');
    this.loadingEditarButton = false;
    this.visibleEditarButton = false;
  }

  async eliminarTransformacion(data:TransformacionesView): Promise<void> { 
    //Primero eliminar el objeto y luego cargar
      const bodyObject: Transformaciones = {
        id: data.id,
        clienteId: this.idMedidor,
        proveedorId: data.proveedor.id,
        transformadorId: data.transformador.id,
        numeroTransf: this.numeroTransformacion.valueOf(),
        fechaInicial: moment().toISOString(true),
        fechaFinal: moment().toISOString(true),
        observacion: 'N/A',
        estado: false
      }
      await this.transformacionesService.deleteTransformaciones(data.id,bodyObject).toPromise();
    
      this.transformacionesTableData = [];
        this.visibleTransformacionesTable = true;
        this.loadingTransformacionesTable = true;
        const transformaciones = await this.transformacionesService.getTransformacionesById(this.idMedidor,this.TransformacionesForm.get('Transformador').value,this.TransformacionesForm.get('ProveedorEnergia').value).toPromise()
        this.numeroTransformacion = this.transformacionesService.handleNumeroTransformacion(transformaciones);
        this.TransformacionesForm.get('NumeroTransformacion').setValue(this.numeroTransformacion);
        transformaciones.forEach((tranf)=>{
            this.transformacionesTableData = 
              [
                ...this.transformacionesTableData,
                this.transformacionesService.createViewObject(tranf,this.selectTransformadores,this.selectProveedores)
              ]
        });

        const indexOfDelete = this.numeroTransformacion.valueOf() - 1;
        this.transformacionesTableData[indexOfDelete].canDelete = true
        console.log(this.transformacionesTableData);
        this.loadingTransformacionesTable = false;
    
  }
}