import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { datosModel } from '../modelos/datos';


const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class DatosService{
    constructor(private http: HttpClient) { }

    getDatos() {
        return this.http.get<datosModel[]>(`${apiUrl}datos?filter[where][estado]=true`)
    }

    getDatosId(id){
        return this.http.get<datosModel[]>(`${apiUrl}datos?filter={"where":{"and":[{"variableId": { "inq": [${id}]}},{"estado":true}]}}`)
    }

    postDatos(datos) {
        return this.http.post(`${apiUrl}datos`, datos);
    }

    putDatos(id, datos) {
        return this.http.put(`${apiUrl}datos/${id}`, datos);
    }

    deleteDatos(id, datos) {
        return this.http.patch(`${apiUrl}datos/${id}`, datos);
    }
}