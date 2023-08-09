import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface JerarquiaModel {
    id: number;
    descripcion: string;
    dependenciaId: number;
    estado: boolean;
}

export interface vJerarquiaModel{
    id: number;
    descripcion: string;
    dependenciaId: number;
    estado: boolean;
    herencia: string;
}

export interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | null;
    sortDirections: NzTableSortOrder[];
  }