import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { NavigationService } from '../../services/navigation.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Observable, Subscription } from 'rxjs';

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

  // Usar Observable e async pipe no template para evitar subscribe manual
  usuarios$!: Observable<Usuario[]>;
  private balanceSub?: Subscription;

  constructor(
    private balance: BalanceService,
    private router: Router,
    public navigationService: NavigationService,
    private usuarioService: UsuarioService
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
        this.saldo = this.entrada - this.saida;
      })
    );

    // Atribui o Observable — o template consome com async
    this.usuarios$ = this.usuarioService.getUsuarios();
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
