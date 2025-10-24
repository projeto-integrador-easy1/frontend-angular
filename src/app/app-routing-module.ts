import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeralComponent } from './components/geral/geral.component';
import { GastosComponent } from './components/gastos/gastos.component';

const routes: Routes = [
  { path: '', redirectTo: 'geral', pathMatch: 'full' },
  { path: 'geral', component: GeralComponent },
  { path: 'gastos', component: GastosComponent },
  { path: 'saldo', component: GeralComponent },
  { path: 'investimentos', component: GeralComponent },
  { path: 'calendario', component: GeralComponent },
  { path: '**', redirectTo: 'geral' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
