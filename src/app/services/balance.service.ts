import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private readonly entradaSubject = new BehaviorSubject<number>(0);
  private readonly saidaSubject = new BehaviorSubject<number>(0);
  readonly entrada$ = this.entradaSubject.asObservable();
  readonly saida$ = this.saidaSubject.asObservable();

  getEntrada() {
    return this.entradaSubject.value;
  }

  getSaida() {
    return this.saidaSubject.value;
  }

  setEntrada(valor: number) {
    this.entradaSubject.next(Number(valor) || 0);
  }

  setSaida(valor: number) {
    this.saidaSubject.next(Number(valor) || 0);
  }
}
