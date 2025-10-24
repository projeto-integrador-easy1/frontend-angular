import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../../services/balance.service';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css']
})
export class GeralComponent implements OnInit {
  entrada = 0;
  saida = 0;
  saldo = 0;

  constructor(private balance: BalanceService) {}

  ngOnInit(): void {
    const b = this.balance.getBalance();
    this.entrada = b.entrada;
    this.saida = b.saida;
    this.saldo = this.entrada - this.saida;
  }
}
