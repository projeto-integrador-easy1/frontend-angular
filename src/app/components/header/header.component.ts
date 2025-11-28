import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  constructor(
    private router: Router,
    public navigationService: NavigationService,
    private usuarioService: UsuarioService
  ) {}

  get rotaAtiva() {
    return this.navigationService.rotaAtiva;
  }

  navegar(rota: string) {
    this.navigationService.setRotaAtiva(rota);
    this.router.navigate([rota]);
  }

  logout() {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }
}
