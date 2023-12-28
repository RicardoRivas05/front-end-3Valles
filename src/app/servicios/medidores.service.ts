import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class MedidorService {

    constructor(
        private http: HttpClient
    ) { }

    // Medidores

    getMedidor() {
        return this.http.get(`${apiUrl}medidors`);
    }

    getvMedidor() {
        return this.http.get(`${apiUrl}v-medidor-variables`);
    }

    postMedidor(medidor) {
        return this.http.post(`${apiUrl}medidors`, medidor);
    }

    putMedidor(id, medidor) {
        return this.http.put(`${apiUrl}medidors/${id}`, medidor);
    }

    deleteMedidor(id, medidor) {
        return this.http.patch(`${apiUrl}medidors/${id}`, medidor);
    }

    getMedidorEntidad() {
        return this.http.get(`${apiUrl}v-medidor-entidad-variables`);
    }


    // Rollover
    getRollover() {
        return this.http.get(`${apiUrl}roll-overs?filter[where][estado]=true`);
    }

    getRolloverMedidor(id) {
        return this.http.get(`${apiUrl}roll-overs?filter[where][medidorId]=${id}`);
    }

    getVariableMedidorRollover(id){
        return this.http.get(`${apiUrl}variable-medidors?filter=
        {
            "where":{
                "medidorId": "${id}"
            },
            "include":[
                {"relation": "rollOvers","scope": {"where": {"estado": true}}}
            ]
        }`);
    }

    postRollover(rollover) {
        return this.http.post(`${apiUrl}roll-overs`, rollover);
    }

    putRollover(id, rollover) {
        return this.http.put(`${apiUrl}roll-overs/${id}`, rollover);
    }

    deleteRollover(id, rollover) {
        return this.http.patch(`${apiUrl}roll-overs/${id}`, rollover);
    }

    // Vista a PME
    getMedidorPME() {
        return this.http.get(`${apiUrl}v-medidor-pmes`);
    }

    //Variables Medidor
    getVariablesPME(id) {
        return this.http.get(`${apiUrl}v-variables-medidors?filter[where][medidorId]=${id}`);
    }

    getAllVariablesPME() {
        return this.http.get(`${apiUrl}v-variables-medidors`);
    }

    getVariable(){
        return this.http.get(`${apiUrl}variables`);
    }

    getVariablePME(){
        return this.http.get(`${apiUrl}v-variable-pmes`);
    }

    deleteVariable(id, variable) {
        return this.http.patch(`${apiUrl}variable-medidors/${id}`, variable);
    }

    putVariable(id, variable) {
        return this.http.put(`${apiUrl}variable-medidors/${id}`, variable);
    }

    postVariable(variable) {
        return this.http.post(`${apiUrl}variable-medidors`, variable);
    }

    //Datos manuales
    getDatos(variable){
        return this.http.get(`${apiUrl}datos?filter[where][variableId]=${variable}`);
    }

    postDatos(data){
        return this.http.post(`${apiUrl}datos`, data);
    }

    putDatos(id, data) {
        return this.http.put(`${apiUrl}datos/${id}`, data);
    }

    deleteDatos(id, data) {
        return this.http.patch(`${apiUrl}datos/${id}`, data);
    }
}
