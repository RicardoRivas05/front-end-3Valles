import { EntidadModel } from "./entidad";

export interface Transformaciones {
    id: number;
    clienteId: number;
    proveedorId: number;
    transformadorId: number;
    numeroTransf: number;
    fechaInicial?: string;
    fechaFinal?: string;
    observacion?: string;
    estado?: boolean;
}

export interface TransformacionesView{
    id: number;
    proveedor: EntidadModel;
    transformador: EntidadModel;
    numeroTransf: number;
    observacion?: string;
    canDelete: boolean;
}