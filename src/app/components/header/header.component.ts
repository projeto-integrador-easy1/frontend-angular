import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  constructor(
    private router: Router,
    public navigationService: NavigationService
  ) {}

  get rotaAtiva() {
    return this.navigationService.rotaAtiva;
  }

  navegar(rota: string) {
    this.navigationService.setRotaAtiva(rota);
    this.router.navigate([rota]);
  }
}
