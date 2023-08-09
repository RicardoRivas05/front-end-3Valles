import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface grupoModel{
    id:number
    nombre: string
    centroCostoId:number
    factorid?:number
}

export interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | null;
    sortDirections: NzTableSortOrder[];
  }