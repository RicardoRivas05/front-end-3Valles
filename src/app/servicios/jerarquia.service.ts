import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class JerarquiaService {

    constructor(private http: HttpClient) { }

    getJerarquia() {
        return this.http.get(`${apiUrl}jerarquias`)
    }

    postJerarquia(jerarquia) {
        return this.http.post(`${apiUrl}jerarquias`, jerarquia);
    }

    putJerarquia(id, jerarquia) {
        return this.http.put(`${apiUrl}jerarquias/${id}`, jerarquia);
    }

    deleteJerarquia(id, jerarquia) {
        return this.http.patch(`${apiUrl}jerarquias/${id}`, jerarquia);
    }

    getVJerarquia() {
        return this.http.get(`${apiUrl}v-jerarquias?filter[where][estado]=true`)
    }

    getDependencia() {
        return this.http.get(`${apiUrl}v-jerarquias`)
    }
}