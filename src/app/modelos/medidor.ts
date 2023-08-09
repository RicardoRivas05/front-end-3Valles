import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  sortDirections: NzTableSortOrder[];
}

export interface MedidorModel{
    id:number;
    sourceId: number;
    descripcion: string;
    lecturaMax: any;
    multiplicador: any;
    observacion: string;
    tipo: boolean;
    estado: boolean;
}

export interface RolloverModel{
    id: number;
    fecha: string;
    variableMedidorId: number;
    energia:number;
    lecturaAnterior: any;
    lecturaNueva: any;
    observacion: string;
    estado: boolean;
  }

  export interface PMEMedidorModel{
    id: number;
    descripcion: string;
  }

  export interface variableModel{
    id:number;
    variableMedidorId:number;
    medidorId:number;
    quantityId: number;
    name: string;
    variableId:number;
    descripcion:string;
    medidor:string;
  }
