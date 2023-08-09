import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {Transformaciones,TransformacionesView} from "src/app/modelos/transformaciones";
import _ from 'lodash';
import { EntidadModel } from "../modelos/entidad";

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class TransformacionesService {

    constructor(private http: HttpClient) { }

    getTransformaciones() {
        return this.http.get(`${apiUrl}transformaciones?filter[where][estado]=true`)
    }

    postTransformaciones(transformaciones) {
        return this.http.post<Transformaciones>(`${apiUrl}transformaciones`, transformaciones);
    }

    putTransformaciones(id, transformaciones) {
        return this.http.put(`${apiUrl}transformaciones/${id}`, transformaciones);
    }

    deleteTransformaciones(id, transformaciones) {
        return this.http.patch(`${apiUrl}transformaciones/${id}`, transformaciones);
    }

    // Funciones extras
    
    createViewObject(data: Transformaciones,transformadores: EntidadModel[], proovedores: EntidadModel[]): TransformacionesView{
        const returnObject: TransformacionesView ={
            id: data.id,
            numeroTransf: data.numeroTransf,
            proveedor: _.find(proovedores,(prov)=> prov.id === data.proveedorId),
            transformador: _.find(transformadores,(tranf)=> tranf.id === data.transformadorId),
            canDelete: false,
            observacion: data.observacion
        }

        return returnObject;
    }


    handleNumeroTransformacion(transformaciones: Transformaciones[]): Number{
        if(transformaciones.length === 0){
            return 0;
        }else{
            const max = _.maxBy(transformaciones, (obj)=> obj.numeroTransf)
            return max.numeroTransf;
        }
    }

    getTransformacionesById(idCliente,idTransformador,idProveedor){
        return this.http.get<Transformaciones[]>(`${apiUrl}transformaciones?filter[where][estado]=true&filter[where][proveedorId]=${idProveedor}&filter[where][transformadorId]=${idTransformador}&filter[where][clienteId]=${idCliente}`);
    }

}