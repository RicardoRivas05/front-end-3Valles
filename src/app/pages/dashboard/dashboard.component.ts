import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { FacturaService } from 'src/app/servicios/factura.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { centroCostoService } from 'src/app/servicios/centroCosto.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('content', { static: true }) content!: ElementRef;

  visible: boolean = false;
  visibleFecha: boolean = false;
  tiempo: any;
  fecha: any;
  fecha1: any = new Date();
  fecha2: any = new Date();
  ventaEnee: number = 0;
  compraEnee: number = 0;
  generacion: number = 0;
  perdida: number = 0;
  consumo: number = 0;
  totalGeneracion: number = 0;
  totalEnee: number = 0;
  totaPlantaE: number = 0;
  totalPlantaE: number = 0;
  totalLinea385: number = 0;
  dataGeneracion: any[] = [];
  dataConsumo: any[] = []
  dataFactura: any;
  contieneRollover: boolean = false;
  calculosNuevos: any;
  rolloverVentaEnee: any;


  backgroundColor = ["#4FC3F7", "#E57373", "#FFF176", "#CE93D8", "#F06292", "#FFAB91", "#18FFFF", "#AED581", "#80CBC4", "#81F7F3", "#F79F81", "#F781F3", "#F2F5A9", "#DC90A3", "#EF517B", "#04B4AE", "#BDBDBD", "#FA8258", "#F5A9D0", "#FCCBC", "#FFE0B2", "#CFD8DC", "#FFD180", "#BCAAA4", "#EEEEEE", "#82B1FF", "#B2FF59", "#FF4081", "#C5CAE9", "#EEFF41"]

  ChartGenetOptions: any = null;
  ChartGenetLabels: any[] = null;
  ChartGenetData: any[] = null;

  ChartConsuOptions: any = null;
  ChartConsuLabels: any[] = null;
  ChartConsuData: any[] = null;

  constructor(
    private spinner: NgxSpinnerService,
    private serviceFactura: FacturaService,
    private serviceCentroCosto: centroCostoService,
    private nzMessageService: NzMessageService,
    private RolloverInfor: FacturaService
  ) { }

  ngOnInit() {
  }

  mostrar() {
    this.fecha1 = undefined;
    this.fecha2 = undefined;
    this.visible = false;
    switch (this.tiempo) {
      case '1': {
        this.fecha1 = moment().startOf('day').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment().format('YYYY-MM-DD HH:mm');
        break;
      }
      case '2': {
        this.fecha1 = moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment().add(-1, 'day').endOf('day').add(1, 'm').format('YYYY-MM-DD HH:mm');

        break;
      }
      case '3': {
        this.fecha1 = moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment().format('YYYY-MM-DD HH:mm')
        break;
      }
      case '4': {
        this.fecha1 = moment(moment().startOf('week')).add(1, 'day').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment().format('YYYY-MM-DD HH:mm');
        break;
      }
      case '5': {
        this.fecha1 = moment().startOf('year').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment().format('YYYY-MM-DD HH:mm');
        break;
      }
      case '6': {
        this.fecha1 = moment(moment().startOf('week').subtract(1, 'week')).add(1, 'day').format('YYYY-MM-DD HH:mm')
        this.fecha2 = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').add(1, 'm').format('YYYY-MM-DD HH:mm')
        break;
      }
      case '7': {
        this.fecha1 = moment(moment().startOf('week').subtract(2, 'week')).add(1, 'day').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').add(1, 'm').format('YYYY-MM-DD HH:mm');
        break;
      }
      case '8': {
        this.fecha1 = moment().startOf('month').format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment().format('YYYY-MM-DD HH:mm');
        break;
      }
      case '9': {
        this.fecha1 = moment(moment().add(-1, 'M').startOf('month')).format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment(moment().add(-1, 'M').endOf('month')).add(1, 'm').format('YYYY-MM-DD HH:mm');
        break;
      }
      case '10': {
        this.fecha1 = moment(moment().add(-1, 'y').startOf('year')).format('YYYY-MM-DD HH:mm');
        this.fecha2 = moment(moment().add(-1, 'y').endOf('year')).add(1, 'm').format('YYYY-MM-DD HH:mm');
        break;
      }
      case '11': {
        if (this.fecha != undefined && this.fecha.length > 0) {
          this.fecha1 = moment(this.fecha[0]).format('YYYY-MM-DD HH:mm');
          this.fecha2 = moment(this.fecha[1]).format('YYYY-MM-DD HH:mm');
        }
        break;
      }
      default:
        break;
    }

    if (this.fecha1 === undefined || this.fecha2 === undefined) {
      this.nzMessageService.warning('No se puede mostrar el reporte, revise las fechas seleccionadas y seleccione un rango de tiempo correcto.');
    }
    else {
      //A partir de Aqui!!!
      this.consumo = 0;
      this.perdida = 0;
      this.totalGeneracion = 0;
      this.totalEnee = 0;
      this.totaPlantaE = 0;
      this.totalLinea385 = 0;

      this.serviceCentroCosto.getCentroCosto()
  .toPromise()
  .then((data: any) => {
    return Promise.all<number>(data.map(centroCosto => {
      return this.serviceFactura.getConsumoMedidores(centroCosto.id, this.fecha1, this.fecha2)
        .toPromise()
        .then((datosConsumo: any) => {
          this.dataFactura = datosConsumo;
          return this.dataFactura.reduce((sum, x) => sum + x.plantaE, 0);
        })
        .catch(error => {
          console.error('Error en getConsumoMedidores:', error);
          // Puedes propagar el error usando Promise.reject
          return Promise.reject(error);
        });
    }));
  })
  .then((sums: number[]) => {
    let totalPlantaE = 0;
    totalPlantaE = sums.reduce((sum, current) => sum + current);

    this.serviceFactura.getGeneracion(false, this.fecha1, this.fecha2)
      .toPromise()
      .then((datos: any) => {
        this.dataGeneracion = datos;
        // Agregar la suma total como una entrada adicional
        this.dataGeneracion.push({
          'descripcion': 'TotalPlantasEmergencia',
          'inicial': 0,
          'final': totalPlantaE
        });

        this.generacion = datos.map(x => x.final - x.inicial).reduce(
          (previousValue, currentValue) => previousValue + currentValue);

        this.ChartGenetOptions = {
          scaleShowVerticalLines: true,
          responsive: true,
          tooltips: {
            enabled: true,
            callbacks: {
              label: function (t, d) {
                return d.labels[t.index] + ': ' + d.datasets[0].data[t.index].toLocaleString('en-US') + ' kWh';
              },
            },
          },
          scale: {
            ticks: {
              callback: value => value.toLocaleString('en-US') + ' kWh'
            }
          }
        };

        this.ChartGenetLabels = this.dataGeneracion.map(x => x.descripcion);
        this.ChartGenetData = [
          {
            data: this.dataGeneracion.map(x => x.final - x.inicial),
            backgroundColor: this.backgroundColor,
            borderColor: this.backgroundColor
          }
        ];
        this.visible = true;
      })
      .catch(error => {
        console.error('Error en getGeneracion:', error);
        // Puedes propagar el error usando Promise.reject
        return Promise.reject(error);
      });
  })
  .catch(error => {
    console.error('Error en getCentroCosto:', error);
    // Manejar el error general aquí
  });

      //******************************** */

        this.serviceFactura.getGeneracion(true, this.fecha1, this.fecha2)
          .toPromise()
          .then((datos: any) => {
            this.compraEnee = datos.map(x => x.final - x.inicial).reduce(
              (previousValue, currentValue) => previousValue + currentValue)

          })

          this.serviceFactura.getVenta(this.fecha1, this.fecha2)
          .toPromise()
          .then((datos: any) => {
            try {
              this.serviceFactura.getexistenciaRollover('Venta a ENEE', this.fecha1, this.fecha2)
                .toPromise()
                .then((data: any) => {
                  this.rolloverVentaEnee = data;

                  if (data.length > 0) {
                    this.ventaEnee = datos.map(x => x.diferencia);

                  // Extrae el valor del array si es un solo valor
                  this.ventaEnee = Array.isArray(this.ventaEnee) ? this.ventaEnee[0] : this.ventaEnee;
                  }else{
                    this.ventaEnee = 0.0
                    let diferencia = datos.map(x => x.diferencia)
                    this.ventaEnee = Array.isArray(diferencia) ? diferencia[0] : this.ventaEnee;
                  }
                })
                .catch(error => {
                  console.error("Error obteniendo existencia de Rollover para 'Venta a ENEE': ", error);
                });
            } catch (error) {
              console.error("Error en el bloque try-catch: ", error);
            }

          })
          .catch(error => {
            console.error("Error obteniendo datos de venta: ", error);
          });

          this.serviceCentroCosto.getCentroCosto()
          .toPromise()
          .then((data: any) => {

            let etiquetas = []
            let valores = []

            this.dataConsumo = []
            data.map(centroCosto => {


              this.serviceFactura.getConsumoMedidores(centroCosto.id, this.fecha1, this.fecha2)
                .toPromise()
                .then((datosConsumo: any) => {
                  this.dataFactura = datosConsumo;
                  let infoConsumo = [];
                  let total = 0
                  let generacionArea = 0
                  let enee = 0
                  let linea385 = 0
                  let plantaE = 0


                  //Calculos de factura
                  this.dataFactura.forEach(data => {
                    infoConsumo.push(data)
                  });;

                  let info = [];
                  let dataRollover = [];
                  let promises = [];
                  let generacion = 0;
                  let consumo = 0;

                  for (let i = 0; i < infoConsumo.length; i++) {
                    info.push(infoConsumo[i].descripcion);
                  }

                  this.dataFactura.forEach(item => {
                    item.Linea385 = 0.0
                    item.PlantaE = 0.0
                    item.contieneRollover = false;
                  });



                  for (let i = 0; i < info.length; i++) {
                    const medidorCodificado = encodeURIComponent(info[i])
                    promises.push(this.RolloverInfor.getexistenciaRollover(medidorCodificado, this.fecha1, this.fecha2).toPromise());
                  }


                  return Promise.all(promises)
                    .then(results => {
                      results.forEach(datos => {
                        if (datos && datos.length > 0) {
                          const medidorConRollover = datosConsumo.find(item => datos.some(rollover => item.descripcion === rollover.descripcion));

                          if (medidorConRollover) {
                            medidorConRollover.contieneRollover = true;
                          }

                          datosConsumo.forEach(data => {
                            infoConsumo.push(data);
                          });


                          const rolloversPorMes = {}

                          datos.forEach(x => {
                            const mes = new Date(x.fecha).getMonth();
                            if (!rolloversPorMes[mes]) {
                              rolloversPorMes[mes] = {
                                lecturaAnterior: 0,
                                lecturaNueva: 0
                              };
                            }

                            rolloversPorMes[mes].lecturaAnterior += x.lecturaAnterior
                            rolloversPorMes[mes].lecturaNueva += x.lecturaNueva;

                            dataRollover.push(x);
                          });

                          datosConsumo.forEach(data => {
                            const mes = new Date(data.fecha).getMonth();
                            if (rolloversPorMes[mes]) {
                              data.lecturaAnterior = rolloversPorMes[mes].lecturaAnterior
                              data.lecturaNueva = rolloversPorMes[mes].lecturaNueva;
                            }
                          });
                        }
                      });

                      this.contieneRollover = dataRollover.length > 0;

                      if (this.contieneRollover) {
                        for (let i = 0; i < info.length; i++) {
                          for (let c = 0; c < dataRollover.length; c++) {
                            if (info[i] === dataRollover[c].descripcion) {
                              datosConsumo.forEach(data => {
                                if (data.descripcion === dataRollover[c].descripcion) {
                                  data.lecturaAnterior = dataRollover[c].lecturaAnterior;
                                  data.lecturaNueva = dataRollover[c].lecturaNueva;
                                }
                              });
                            }
                          }
                        }
                      }

                      datosConsumo.map(x => {
                        if (x.contieneRollover) {
                          consumo = ((x.final - x.lecturaNueva) + (x.inicial - x.lecturaAnterior)) * x.operacion
                        } else {
                          consumo = (x.final - x.inicial) * x.operacion
                        }

                        x.contieneRollover
                          ? total += ((x.final - x.lecturaNueva) - (x.inicial - x.lecturaAnterior)) * x.operacion
                          : total += (x.final - x.inicial) * x.operacion

                          x.contieneRollover
                          ?generacionArea += ((((x.final - x.lecturaNueva) - (x.inicial - x.lecturaAnterior)) - (x.Enee + x.plantaE)) * x.operacion)
                          :generacionArea += x.Generacion * x.operacion


                        enee += x.Enee * x.operacion


                        x.contieneRollover
                          ?generacion = (((x.final - x.lecturaNueva) - (x.inicial - x.lecturaAnterior) - (x.Enee + x.plantaE)) * x.operacion )
                          :generacion = x.Generacion * x.operacion

                        plantaE += x.plantaE
                        linea385 += x.linea385
                        this.consumo += consumo
                        this.perdida = ((this.generacion + plantaE)+ (this.compraEnee + linea385)) - (this.consumo + this.ventaEnee)
                        this.totalGeneracion += generacion
                        this.totalEnee += x.Enee * x.operacion
                        this.totalLinea385 += x.linea385
                        this.totaPlantaE += x.plantaE
                      })
                      etiquetas.push(centroCosto.nombre)
                      valores.push(total)
                      this.dataConsumo = [...this.dataConsumo, { nombre: centroCosto.nombre, valor: total, generaciones: generacionArea, enee: enee,  PlantaE:plantaE, Linea385:linea385 }]
                    })
                })
          })

          //Hasta Aqui!!!!


          //// Grafico Consumo
          this.ChartConsuOptions = {
            responsive: true,
            tooltips: {
              callbacks: {
                label: function (t, d) {
                  return d.labels[t.index] + ': ' + d.datasets[0].data[t.index].toLocaleString('en-US') + ' kWh';
                },
              },
            }
          };
          this.ChartConsuLabels = etiquetas
          this.ChartConsuData = [
            {
              data: valores,
              backgroundColor: this.backgroundColor,
            }
          ];
        })
      this.visible = true;
    }
  }

  changeRango(index) {
    this.visibleFecha = index === '11' ? true : false;
  }

  imprimir(): void {
    this.spinner.show();
    const div: any = document.getElementById('content');

    const options = {
      background: 'white',
      scale: 5
    };

    const doc = new jsPDF('p', 'mm', 'letter', true);

    html2canvas(div, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      (doc as any).addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save(`Dashboard.pdf`);
      this.spinner.hide();
    });

  }

}
