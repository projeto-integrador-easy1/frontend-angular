import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-geral',
  imports: [CommonModule],
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
    public nav: NavigationService
  ) { }

  ngOnInit(): void {
    this.inicializarValores();
    this.inscreverMudancasBalance();
  }

  private inicializarValores(): void {
    this.entrada = this.balance.getEntrada();
    this.saida = this.balance.getSaida();
    this.calcularSaldo();
  }

  private inscreverMudancasBalance(): void {
    this.balanceSub = new Subscription();

    this.balanceSub.add(
      this.balance.entrada$.subscribe((valor) => {
        this.entrada = valor;
        this.calcularSaldo();
      })
    );

    this.balanceSub.add(
      this.balance.saida$.subscribe((valor) => {
        this.saida = valor;
        this.calcularSaldo();
      })
    );
  }

  private calcularSaldo(): void {
    this.saldo = this.entrada - this.saida;
  }

  navegar(rota: string) {
    this.nav.setRotaAtiva(rota);
    this.router.navigate([rota]);
  }

  ngOnDestroy(): void {
    this.balanceSub?.unsubscribe();
  }
}
