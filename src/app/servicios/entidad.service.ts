import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntidadModel } from '../modelos/entidad';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class EntidadService {

    constructor(private http: HttpClient) { }

    getEntidad(tipo) {
        return this.http.get<EntidadModel[]>(`${apiUrl}entidads?filter[where][and][0][estado]=true&filter[where][and][1][entidad]=${tipo}`)
    }

    postEntidad(entidad) {
        return this.http.post(`${apiUrl}entidads`, entidad);
    }

    putEntidad(id, entidad) {
        return this.http.put(`${apiUrl}entidads/${id}`, entidad);
    }

    deleteEntidad(id, entidad) {
        return this.http.patch(`${apiUrl}entidads/${id}`, entidad);
    }

    getEntidadFilter() {
        return this.http.get(`${apiUrl}entidads?filter={"where":{"and":[{"entidad":0},{"estado":true}]}}`)
    }

    // medidoresEntidad

    getMedidorEntidad(id) {
        return this.http.get(`${apiUrl}medidor-entidads?filter=
        {
            "where":{
            "and":[
            {"estado":true},{"entidadId":${id}}
            ]
            },
              "include": [
                {
                  "relation": "variableMedidor",
                  "scope":{
                  "include":[{"relation":"variable"},{"relation":"medidor"}]
            }
                },
                {
                  "relation": "jerarquia"
                }
              ]
        }`)
    }

    postMedidorEntidad(medidorEntidad) {
        return this.http.post(`${apiUrl}medidor-entidads`, medidorEntidad);
    }

    putMedidorEntidad(id, medidorEntidad) {
        return this.http.put(`${apiUrl}medidor-entidads/${id}`, medidorEntidad);
    }

    deleteMedidorEntidad(id, medidorEntidad) {
        return this.http.patch(`${apiUrl}medidor-entidads/${id}`, medidorEntidad);
    }
}
