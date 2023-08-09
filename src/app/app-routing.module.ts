import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumidoresComponent } from './pages/consumidores/consumidores.component';
import { EntradaComponent } from './pages/entrada/entrada.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { JerarquiaComponent } from './pages/jerarquia/jerarquia.component';
import { LoginComponent } from './pages/login/login.component';
import { MedidorComponent } from './pages/medidor/medidor.component';
import { MenuComponent } from './pages/menu/menu.component';
import { TransformadoresComponent } from './pages/transformadores/transformadores.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VistaComponent } from './pages/vista/vista.component';
import { ModalMedidorComponent } from './pages/vista/modal-medidor/modal-medidor.component';
import { ModalFactorComponent } from './pages/vista/modal-factor/modal-factor.component';
import { ModalEditarComponent } from './pages/vista/modal-editar/modal-editar.component';
import { GruposComponent } from './pages/grupos/grupos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: MenuComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'medidor', component: MedidorComponent },
      { path: 'jerarquia', component: JerarquiaComponent },
      { path: 'consumidores', component: ConsumidoresComponent },
      { path: 'entrada', component: EntradaComponent },
      { path: 'transformadores', component: TransformadoresComponent },
      { path: 'factura', component: FacturaComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path:'vista',component:VistaComponent, 
      children: [
        { path: 'modal-factor', component: ModalFactorComponent },
        { path: 'modal-medidor', component: ModalMedidorComponent},
        { path: 'modal-editar', component: ModalEditarComponent }
    ]},
    {path:'grupos',component:GruposComponent}
    ]
  }
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
