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
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarTransacoes();
  }

  // --- Gestão do Modal e Formulário ---

  abrirModal(): void {
    this.transacaoEditando = null; // Garante que estamos no modo de criação
    this.inicializarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEdicao(index: number): void {
    this.transacaoEditando = this.movimentos[index];
    if (!this.transacaoEditando) return;

    // Preenche o formulário com os dados da transação existente
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
    // Define os campos e validações do formulário
    this.formTransacao = this.fb.group({
      tipo: ['gasto', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      data: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  // --- Lógica de Salvar (Criar ou Editar) ---

  salvarTransacao(): void {
    // Se o formulário estiver inválido (ex: campos vazios), não faz nada
    if (this.formTransacao.invalid) return;

    const transacaoParaSalvar = this.montarObjetoTransacao();

    if (this.transacaoEditando) {
      this.atualizarTransacaoExistente(this.transacaoEditando.id!, transacaoParaSalvar);
    } else {
      this.criarNovaTransacao(transacaoParaSalvar);
    }
  }

  // Cria o objeto Transacao a partir dos dados do formulário
  private montarObjetoTransacao(): Transacao {
    const { tipo, nome, descricao, valor, data } = this.formTransacao.value;
    // Usa o ID do usuário logado ou 1 como padrão
    const usuarioId = this.usuarioService.usuarioLogado?.id || 1;

    return {
      nome: nome.toUpperCase(),
      tipo: tipo === 'gasto' ? 'Despesa' : 'Receita',
      valor: Number(valor),
      data,
      descricao: descricao || '',
      usuario: { id: usuarioId }
    };
  }

  private criarNovaTransacao(transacao: Transacao): void {
    this.transacaoService.criar(transacao).subscribe({
      next: (novaTransacao) => {
        this.movimentos.push(novaTransacao); // Adiciona na lista local
        this.finalizarOperacao();
      },
      error: () => this.fecharModal()
    });
  }

  private atualizarTransacaoExistente(id: number, transacao: Transacao): void {
    this.transacaoService.atualizar(id, transacao).subscribe({
      next: () => {
        // Encontra e atualiza a transação na lista local
        const index = this.movimentos.findIndex(t => t.id === id);
        if (index !== -1) {
          this.movimentos[index] = { ...transacao, id: id };
        }
        this.finalizarOperacao();
      },
      error: () => this.fecharModal()
    });
  }

  // Atualiza a tela e fecha o modal após sucesso
  private finalizarOperacao(): void {
    this.atualizarBalance();
    this.fecharModal();
    this.cdr.detectChanges(); // Força a atualização da tela
  }

  // --- Outras Operações ---

  removerTransacao(index: number): void {
    const id = this.movimentos[index]?.id;
    if (!id) return;

    this.transacaoService.deletar(id).subscribe({
      next: () => {
        this.movimentos.splice(index, 1); // Remove da lista visualmente
        this.atualizarBalance();
        this.cdr.detectChanges();
      },
      error: () => console.error('Erro ao deletar')
    });
  }

  carregarTransacoes(): void {
    this.carregando = true;
    const usuarioId = this.usuarioService.usuarioLogado?.id;

    this.transacaoService.buscarTodas().subscribe({
      next: (transacoes) => {
        // Filtra as transações apenas do usuário logado
        if (usuarioId) {
          this.movimentos = (transacoes || []).filter(t => t.usuario?.id === usuarioId);
        } else {
          this.movimentos = transacoes || [];
        }

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

  // Recalcula o total de entradas e saídas
  atualizarBalance(): void {
    const entradas = this.calcularTotalPorTipo(true);
    const saídas = this.calcularTotalPorTipo(false);

    this.balance.setEntrada(entradas);
    this.balance.setSaida(saídas);
  }

  // Função auxiliar para somar valores (simplifica o reduce)
  private calcularTotalPorTipo(ehReceita: boolean): number {
    return this.movimentos
      .filter(m => this.isReceita(m.tipo) === ehReceita)
      .reduce((total, m) => total + m.valor, 0);
  }

  isReceita(tipo: TipoTransacao): boolean {
    return tipo === 'entrada' || tipo === 'Receita';
  }
}
