import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import 'tslib';
import { HttpHeaders } from '@angular/common/http';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  /*  getDetalle(fechai:string,fechaf:string,medidor:number) {
        return this.http.get(`${apiUrl}factura-datos/${medidor}?fechai=${fechai}&fechaf=${fechaf}`)
    }
  */

  getConsumoMedidores(cc: number, f1: string, f2: string) {
    const formattedF1 = f1.toString();
  const formattedF2 = f2.toString();
  const headers = new HttpHeaders().set('timeout', '30000')
  return this.http.get(`${apiUrl}consumo-medidores?cc=${cc}&f1=${formattedF1}&f2=${formattedF2}`, { headers });
  }

  getRollOvers(){
    return this.http.get(`${apiUrl}`)
  }

  getFactores(grupo: number) {
    return this.http.get(`${apiUrl}factores-factura?grupo=${grupo}`)
  }

  getexistenciaRollover(descripcion:string, f1:string, f2:string){
    return this.http.get(`${apiUrl}existenciaRollover?descripcion=${descripcion}&f1=${f1}&f2=${f2}`)
  }

  getGeneracion(tipo: boolean, f1: string, f2: string) {
    return this.http.get(`${apiUrl}generacion?tipo=${tipo}&f1=${f1}&f2=${f2}`)
  }

  getVenta(f1: string, f2: string) {
    return this.http.get(`${apiUrl}ventaEnee?f1=${f1}&f2=${f2}`)
  }

}
