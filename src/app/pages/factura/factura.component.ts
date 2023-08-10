import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { EntidadService } from 'src/app/servicios/entidad.service';
import { MedidorService } from 'src/app/servicios/medidores.service';
import { FacturaService } from './../../servicios/factura.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { centroCostoService } from 'src/app/servicios/centroCosto.service';
import { grupoService } from 'src/app/servicios/grupo.service';
import { RolloverModel } from '../../modelos/medidor';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  @ViewChild('content', { static: true }) content!: ElementRef;

  visible: boolean = false;
  visibleFecha: boolean = false;
  fecha: any;
  fecha3: any;
  dias:any;
  // cliente: any;
  centroCosto: any;
  //  medidor: any;
  grupo: any;
  tiempo: any;
  listOfEntidad: any[] = [];
  listOfCentroCosto: any[] = [];
  listOfGrupo: any[] = [];
  listOfGrupoFiltrado: any[] = [];
  factores: any;
  /*  listOfMedidor: any[] = [];
    listOfMedidorFiltrado: any[] = [];*/
  fechaDia: any = new Date();
  fecha1: any = new Date();
  fecha2: any = new Date();
  barChartOptions: any;
  barChartLabels: any[] = [];
  barChartType: any;
  barChartLegend: any;
  barChartData: any[] = [];
  dataFactura: any;
  totalMedicion: number = 0;
  totalGeneracion: number;
  totalEnee: number;
  detallePerdidas: any[] = [];
  consumoHistorico: any[] = [];
  boolCC:boolean = false;
  facturaNo:any;
  variableMedidorId:number;
  lecturaAnterior: number;
  lecturaNueva: number;
  estado: number;
  rollOverInfo: any;
 contieneRollover: boolean = false;

  ChartOptions: any;
  ChartLabels: any[] = [];
  ChartData: any[] = [];
  ChartType: any;
  backgroundColor = ["#D3EBCD", "#AEDBCE", "#635666", "#839AA8", "#2B7A0B", "#EAE509", "#7DCE13", "#5BB318"]


  constructor(
    private spinner: NgxSpinnerService,
    /*    private serviceEntidad: EntidadService,
        private serviceMedidor: MedidorService,*/
    private serviceFactura: FacturaService,
    private serviceCentroCosto: centroCostoService,
    private serviceGrupo: grupoService,
    private nzMessageService: NzMessageService,
    private RolloverInfor: FacturaService
  ) { }

  ngOnInit() {
    this.serviceCentroCosto.getCentroCosto()
      .toPromise()
      .then((data: any) => {
        this.listOfCentroCosto = data;
        this.serviceGrupo.getGrupo()
          .toPromise()
          .then((data: any) => this.listOfGrupo = data)
      })

    this.dataFactura = '';

    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      tooltips: {
        callbacks: {
          label: t => t.yLabel.toLocaleString('en-US') + ' kWh'
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: value => value.toLocaleString('en-US') + ' kWh'
          }
        }]
      },
      title: {
        display: true,
        text: 'Historico Consumo'
      }
    };
    this.barChartType = 'bar';
    this.barChartLegend = true;
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////

  async mostrar() {
    this.visible = false;
    this.fecha1 = undefined;
    this.fecha2 = undefined;

    let data: any[] = [];
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
    if (this.centroCosto === undefined || this.fecha1 === undefined || this.fecha2 === undefined) {
      this.nzMessageService.warning('No se puede mostrar el reporte, revise el medidor y las fechas seleccionadas y seleccione los correctos.');
    }
    else {/////////////////////Es aquie!!!!
      this.dias=moment(this.fecha2).diff(moment(this.fecha1),'days');
      this.facturaNo=moment(this.fecha1).format('MMMM')+' - '+moment(this.fecha1).format('YYYY');

      let etiquetas=[];
      let consumoHistorico=[];

      this.serviceFactura.getConsumoMedidores(this.centroCosto.id, this.fecha1, this.fecha2)
      .toPromise()
      .then((datos: any) => {
        this.dataFactura = datos
        let infoConsumo=[]
        this.totalMedicion = 0
        this.totalGeneracion = 0
        this.totalEnee = 0

      this.dataFactura.forEach(data => {
        infoConsumo.push(data);
      });

      let info=[];
      let dataRollover=[]
      let promises= []

      for(let i=0;i<infoConsumo.length;i++){
        info.push(infoConsumo[i].descripcion);
      }

      this.dataFactura.forEach(item => {
        item.contieneRollover = false;
      });


        for (let i = 0; i < info.length; i++) {
          const medidorCodificado = encodeURIComponent(info[i])
          promises.push(this.RolloverInfor.getexistenciaRollover(medidorCodificado, this.fecha1, this.fecha2).toPromise());
        }

        return Promise.all(promises)
          .then(results => {
            console.log("results: ", results)
            results.forEach(datos => {
              if (datos && datos.length > 0) {
                const medidorConRollover = this.dataFactura.find(item => datos.some(rollover => item.descripcion === rollover.descripcion));

                if (medidorConRollover) {
                  medidorConRollover.contieneRollover = true;
                }

                this.dataFactura.forEach(data => {
                  infoConsumo.push(data);

                });

                etiquetas.push(moment(this.fecha1).format('MMMM'));
                consumoHistorico.push(this.totalMedicion);

                const rolloversPorMes = {};

                datos.forEach(x => {
                  const mes = new Date(x.fecha).getMonth();
                  if (!rolloversPorMes[mes]) {
                    rolloversPorMes[mes] = {
                      lecturaAnterior: 0, // Inicializar a 0
                      lecturaNueva: 0 // Inicializar a 0
                    };
                  }
                  rolloversPorMes[mes].lecturaAnterior += x.lecturaAnterior;
                  rolloversPorMes[mes].lecturaNueva += x.lecturaNueva;

                  dataRollover.push(x);
                });

                this.dataFactura.forEach(data => {
                  const mes = new Date(data.fecha).getMonth();
                  if (rolloversPorMes[mes]) {
                    data.lecturaAnterior = rolloversPorMes[mes].lecturaAnterior;
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
                    this.dataFactura.forEach(data => {
                      if (data.descripcion === dataRollover[c].descripcion) {
                        data.lecturaAnterior = dataRollover[c].lecturaAnterior;
                        data.lecturaNueva = dataRollover[c].lecturaNueva;
                      }
                    });
                  }
                }
              }
            }

            this.totalMedicion = 0;
            console.log(this.dataFactura)
            this.dataFactura.forEach(data => {
              const medicion = data.contieneRollover
              ?((data.final - data.lecturaNueva) - (data.inicial-data.lecturaAnterior)) * data.operacion
              :(data.final - data.inicial) * data.operacion

              const generacion = data.Generacion * data.operacion;
              const enee = (data.Enee * data.operacion) + 100;

              this.totalMedicion += medicion
              this.totalGeneracion += generacion
              console.log(this.totalMedicion, "%",medicion)
              this.totalEnee += enee;
            });



        let f1=this.fecha1;
        let f2=this.fecha2;


          for(let z=1;z<6;z++){
            f1= moment(f1).add(-1, 'month').startOf('day').format('YYYY-MM-DD HH:mm');
            f2= moment(f2).add(-1, 'month').startOf('day').format('YYYY-MM-DD HH:mm');
            etiquetas.push(moment(f1).format('MMMM'));
            this.serviceFactura.getConsumoMedidores(this.centroCosto.id,f1,f2)
            .toPromise()
            .then((datos: any) => {
              consumoHistorico.push(datos.map(x=> x.final-x.inicial).reduce((z,y)=>z+y));
            })
          }

      })//Cierre del getExistencias metod. 2
    })

    console.log()

        this.serviceFactura.getFactores(this.centroCosto.id)
          .toPromise()
          .then((datos: any) => {
            this.factores = datos
            this.boolCC = datos.length > 0 ? true:false
           //// Grafico Consumo
           let etiquetas=[];
           let data=[]
           datos.map(x=>{
            etiquetas.push(x.nombre)
            data.push(x.valor*100)
          })

           this.ChartOptions = {
            responsive: true,
              legend: {
                position:'right'
              },
            tooltips: {
              callbacks: {
                label: function (t, d) {
                  return d.labels[t.index] + ': ' + d.datasets[0].data[t.index].toLocaleString('en-US') + ' %';
                },
              },
            }
          };
          this.ChartLabels = etiquetas

          this.ChartData = [
            {
              //data: datos.detalleConsumo.filter((item) => item.tipoEntidad === false).map((item) => item.Consumo),
              data: data,
              backgroundColor: this.backgroundColor,
            }
          ];
          this.ChartType = 'pie';
          })

      this.barChartLabels=etiquetas;
      this.barChartData = [
        {
          data:consumoHistorico,
          label:'Energia Activa(kWh)',
          backgroundColor: ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(54, 162, 235, 0.8)','rgba(54, 162, 235, 0.8)','rgba(54, 162, 235, 0.8)','rgba(54, 162, 235, 0.8)']
        }
      ];
      this.visible = true;
      }
  }

/////////////////////////////////////////////////////////////////////////////////////////////////////////



  changeCentroCosto(centroCosto) {
    this.listOfGrupoFiltrado = this.listOfGrupo.filter(x => x.centroCostoId === centroCosto.id);
    this.grupo = undefined;
  }
  changeRango(index) {
    this.visibleFecha = index === '11' ? true : false;
  }

  imprimir(): void {
    this.spinner.show();
    const div: any = document.getElementById('content');

    const options = {
      background: 'white',
      scale: 3
    };

    const doc = new jsPDF('p', 'mm', 'a4', true);

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
      doc.save(`Factura.pdf`);
      this.spinner.hide();
    });

  }
}

