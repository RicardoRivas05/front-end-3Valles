import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { centroCostoModel } from '../modelos/centroCosto';

const apiUrl = environment.apiUrl;
@Injectable({
    providedIn: 'root'
})
export class centroCostoService{
    constructor(private http: HttpClient) { }

    getCentroCosto(){
        return this.http.get<centroCostoModel[]>(`${apiUrl}centro-costos`)
    }
}