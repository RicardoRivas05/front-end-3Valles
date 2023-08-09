import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface EntidadModel {
    id: number;
    codigo: string;
    descripcion: string;
    tipo: boolean;
    entidad: number;
    observacion: string;
    estado: boolean;
}

export interface MedidorEntidadModel {
    id: number;
    medidorId: number;
    entidadId: number;
    fechaInicial: string;
    fechaFinal: string;
    jerarquiaId: number;
    observacion: string;
    estado: boolean;
}

export interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | null;
    sortDirections: NzTableSortOrder[];
  }