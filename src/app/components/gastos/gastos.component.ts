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
  transacaoEditando: Transacao | null = null;

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
    this.transacaoEditando = null;
    this.inicializarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEdicao(index: number): void {
    this.transacaoEditando = this.movimentos[index];
    if (!this.transacaoEditando) return;

    const tipoForm = this.transacaoEditando.tipo === 'Despesa' ? 'gasto' : 'entrada';
    
    this.formTransacao = this.fb.group({
      tipo: [tipoForm, Validators.required],
      nome: [this.transacaoEditando.nome, [Validators.required, Validators.minLength(3)]],
      descricao: [this.transacaoEditando.descricao || ''],
      valor: [this.transacaoEditando.valor, [Validators.required, Validators.min(0.01)]],
      data: [this.transacaoEditando.data, Validators.required]
    });
    
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.transacaoEditando = null;
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

    if (this.transacaoEditando?.id) {
      const idEditando = this.transacaoEditando.id;
      this.transacaoService.atualizar(idEditando, transacao).subscribe({
        next: () => {
          const index = this.movimentos.findIndex(t => t.id === idEditando);
          if (index !== -1) {
            this.movimentos[index] = { ...transacao, id: idEditando };
          }
          this.atualizarBalance();
          this.fecharModal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.fecharModal();
        }
      });
    } else {
      this.transacaoService.criar(transacao).subscribe({
        next: (novaTransacao) => {
          this.movimentos.push(novaTransacao);
          this.atualizarBalance();
          this.fecharModal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.fecharModal();
        }
      });
    }
  }

  removerTransacao(index: number): void {
    const id = this.movimentos[index]?.id;
    if (!id) return;

    this.transacaoService.deletar(id).subscribe({
      next: () => {
        // Remover localmente de forma otimista
        this.movimentos.splice(index, 1);
        this.atualizarBalance();
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  isReceita(tipo: TipoTransacao): boolean {
    return tipo === 'entrada' || tipo === 'Receita';
  }

  carregarTransacoes(): void {
    this.carregando = true;
    this.cdr.detectChanges();
    
    const usuarioId = this.usuarioService.usuarioLogado?.id;

    this.transacaoService.buscarTodas().subscribe({
      next: (transacoes) => {
        this.movimentos = usuarioId 
          ? (transacoes || []).filter(t => t.usuario?.id === usuarioId)
          : (transacoes || []);
        this.atualizarBalance();
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
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
