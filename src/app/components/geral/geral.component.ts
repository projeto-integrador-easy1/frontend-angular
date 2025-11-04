import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css'],
})
export class GeralComponent implements OnInit, OnDestroy {
  entrada = 0;
  saida = 0;
  saldo = 0;
  private balanceSub?: Subscription;

  constructor(
    private balance: BalanceService, 
    private router: Router,
    public navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.entrada = Number(this.balance.getEntrada()) || 0;
    this.saida = Number(this.balance.getSaida()) || 0;
    this.saldo = this.entrada - this.saida;

    this.balanceSub = new Subscription();
    this.balanceSub.add(
      this.balance.entrada$.subscribe((entrada) => {
        this.entrada = Number(entrada) || 0;
        this.saldo = this.entrada - this.saida;
      })
    );
    this.balanceSub.add(
      this.balance.saida$.subscribe((saida) => {
        this.saida = Number(saida) || 0;
        this.saldo = this.entrada - this.saida; // pode ficar negativo
      })
    );
  }

  get rotaAtiva() {
    return this.navigationService.rotaAtiva;
  }

  navegar(rota: string) {
    this.navigationService.setRotaAtiva(rota);
    this.router.navigate([rota]);
  }

  ngOnDestroy(): void {
    this.balanceSub?.unsubscribe();
  }
}
