import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../services/balance.service';
import { Transacao, TipoTransacao } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';
import { UsuarioService } from '../../services/usuario.service';

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
  carregando = true;

  constructor(
    private balance: BalanceService,
    private fb: FormBuilder,
    private transacaoService: TransacaoService,
    private usuarioService: UsuarioService,
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
    this.formTransacao = this.fb.group({
      tipo: ['gasto', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      data: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  criarTransacao(): void {
    if (this.formTransacao.invalid) return;

    const { tipo, nome, descricao, valor, data } = this.formTransacao.value;
    const usuarioId = this.usuarioService.usuarioLogado?.id || 1;
    
    const transacao: Transacao = {
      nome: nome.toUpperCase(),
      tipo: tipo === 'gasto' ? 'Despesa' : 'Receita',
      valor: Number(valor),
      data,
      descricao: descricao || '',
      usuario: { id: usuarioId }
    };

    this.transacaoService.criar(transacao).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.carregarTransacoes();
      },
      error: (err) => {
        console.error('Erro ao criar transação:', err);
        this.mostrarModal = false;
      }
    });
  }

  removerTransacao(index: number): void {
    const id = this.movimentos[index]?.id;
    if (!id) return;

    this.transacaoService.deletar(id).subscribe({
      next: () => this.carregarTransacoes(),
      error: () => {}
    });
  }

  isReceita(tipo: TipoTransacao): boolean {
    return tipo === 'entrada' || tipo === 'Receita';
  }

  carregarTransacoes(): void {
    console.log('Iniciando carregamento de transações...');
    this.carregando = true;
    this.cdr.detectChanges();
    
    const usuarioId = this.usuarioService.usuarioLogado?.id;
    console.log('Usuario logado ID:', usuarioId);

    this.transacaoService.buscarTodas().subscribe({
      next: (transacoes) => {
        console.log('Transações recebidas:', transacoes);
        // Se houver usuário logado, filtra por ele, senão mostra todas
        this.movimentos = usuarioId 
          ? (transacoes || []).filter(t => t.usuario?.id === usuarioId)
          : (transacoes || []);
        console.log('Movimentos filtrados:', this.movimentos);
        this.atualizarBalance();
        this.carregando = false;
        this.cdr.detectChanges();
        console.log('Carregamento finalizado, carregando =', this.carregando);
      },
      error: (err) => {
        console.error('Erro ao carregar transações:', err);
        this.movimentos = [];
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  atualizarBalance(): void {
    const entradas = this.movimentos.filter(m => this.isReceita(m.tipo)).reduce((s, m) => s + m.valor, 0);
    const saidas = this.movimentos.filter(m => !this.isReceita(m.tipo)).reduce((s, m) => s + m.valor, 0);
    this.balance.setEntrada(entradas);
    this.balance.setSaida(saidas);
  }
}
