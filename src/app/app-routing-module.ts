import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeralComponent } from './components/geral/geral.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { TelaPlaceholderComponent } from './components/tela-placeholder/tela-placeholder.component';

const routes: Routes = [
  { path: '', redirectTo: 'geral', pathMatch: 'full' },
  { path: 'geral', component: GeralComponent },
  { path: 'gastos', component: GastosComponent },
  { path: 'saldo', component: TelaPlaceholderComponent, data: { mensagem: 'Tela de saldo carregando ...' } },
  { path: 'investimentos', component: TelaPlaceholderComponent, data: { mensagem: 'Tela de investimentos carregando ....' } },
  { path: 'calendario', component: TelaPlaceholderComponent, data: { mensagem: 'Tela de calendário carregando ...' } },
  { path: '**', redirectTo: 'geral' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
