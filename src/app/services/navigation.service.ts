import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  rotaAtiva = 'geral';

  setRotaAtiva(rota: string) {
    this.rotaAtiva = rota;
  }
}

