import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../services/balance.service';
import { Transacao, TipoTransacao } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';

@Component({
  standalone: true,
  selector: 'app-gastos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {
  movimentos: Transacao[] = [];
  mostrarModal = false;
  formTransacao!: FormGroup;

  constructor(
    private balance: BalanceService,
    private fb: FormBuilder,
    private transacaoService: TransacaoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarTransacoes();
  }

  abrirModal(): void {
    this.inicializarFormulario();
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  inicializarFormulario(): void {
    const dataAtual = new Date().toISOString().split('T')[0];
    this.formTransacao = this.fb.group({
      tipo: ['gasto', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      data: [dataAtual, Validators.required]
    });
  }

  criarTransacao(): void {
    if (this.formTransacao.invalid) {
      return;
    }

    const transacao = this.montarTransacao();

    this.transacaoService.criarTransacao(transacao).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.carregarTransacoes();
      },
      error: () => {}
    });
  }

  removerTransacao(index: number): void {
    const transacao = this.movimentos[index];
    if (!transacao.id) {
      return;
    }

    this.transacaoService.deletarTransacao(transacao.id).subscribe({
      next: () => {
        this.carregarTransacoes();
      },
      error: () => {}
    });
  }

  isReceita(tipo: TipoTransacao): boolean {
    return tipo === 'entrada' || tipo === 'Receita';
  }

  carregarTransacoes(): void {
    this.transacaoService.buscarTodasTransacoes().subscribe({
      next: (transacoes) => {
        this.movimentos = transacoes || [];
        this.atualizarBalance();
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  atualizarBalance(): void {
    this.balance.setEntrada(this.calcularTotal('entrada', 'Receita'));
    this.balance.setSaida(this.calcularTotal('gasto', 'Despesa'));
  }

  calcularTotal(tipo1: TipoTransacao, tipo2: TipoTransacao): number {
    return this.movimentos
      .filter(m => m.tipo === tipo1 || m.tipo === tipo2)
      .reduce((soma, m) => soma + m.valor, 0);
  }

  montarTransacao(): Transacao {
    const { tipo, nome, descricao, valor, data } = this.formTransacao.value;
    const tipoTransacao: TipoTransacao = tipo === 'gasto' ? 'Despesa' : 'Receita';

    return {
      nome: nome.toUpperCase(),
      tipo: tipoTransacao,
      valor: Number(valor),
      data: data,
      descricao: descricao || '',
      usuario: { id: 1 }
    };
  }
}
