import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeralComponent } from './components/geral/geral.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { TelaPlaceholderComponent } from './components/tela-placeholder/tela-placeholder.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';

const routes: Routes = [
  { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'geral', component: GeralComponent },
  { path: 'gastos', component: GastosComponent },
  { path: 'saldo', component: TelaPlaceholderComponent, data: { mensagem: 'Tela de saldo carregando ...' } },
  { path: 'investimentos', component: TelaPlaceholderComponent, data: { mensagem: 'Tela de investimentos carregando ....' } },
  { path: 'calendario', component: TelaPlaceholderComponent, data: { mensagem: 'Tela de calendário carregando ...' } },
  { path: '**', redirectTo: 'cadastro' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
