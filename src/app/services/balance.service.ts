import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  getBalance() {
    return { entrada: 0, saida: 270.00 };
  }
}
