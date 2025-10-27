import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css'],
})
export class GeralComponent implements OnInit {
  entrada = 0;
  saida = 0;
  saldo = 0;

  constructor(
    private balance: BalanceService, 
    private router: Router,
    public navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    const b = this.balance.getBalance();
    this.entrada = Number(b.entrada) || 0;
    this.saida = Number(b.saida) || 0;
    this.saldo = this.entrada - this.saida;
  }

  get rotaAtiva() {
    return this.navigationService.rotaAtiva;
  }

  navegar(rota: string) {
    this.navigationService.setRotaAtiva(rota);
    this.router.navigate([rota]);
  }
}
