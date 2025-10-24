import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  rotaAtiva = 'geral';

  constructor(private router: Router) {}

  navegar(rota: string) {
    this.rotaAtiva = rota;
    this.router.navigate([rota]);
  }
}
