import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../services/balance.service';

@Component({
  standalone: true,
  selector: 'app-gastos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {
  private readonly STORAGE_KEY = 'movimentos';
  movimentos: Array<{ tipo: 'gasto' | 'entrada'; nome: string; descricao: string; valor: number }> = [];
  mostrarModal = false;
  formTransacao!: FormGroup;

  constructor(
    private balance: BalanceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formTransacao = this.fb.group({
      tipo: ['gasto', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      valor: [null, [Validators.required, Validators.min(0.01)]]
    });

    this.movimentos = this.loadMovimentos();
    this.balance.setEntrada(this.totalEntradas());
    this.balance.setSaida(this.totalSaidas());
  }

  abrirModal() {
    this.formTransacao.reset({ tipo: 'gasto', nome: '', descricao: '', valor: null });
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  criarTransacao(): void {
    if (this.formTransacao.valid) {
      const dados = this.formTransacao.value;
      const transacao = {
        tipo: dados.tipo,
        nome: dados.nome.toUpperCase(),
        descricao: dados.descricao,
        valor: Number(dados.valor)
      };

      console.log('Transação salva:', transacao);

      // Aqui você pode enviar os dados para um serviço HTTP, por exemplo:
      // this.transacaoService.salvar(transacao).subscribe(...)

      this.movimentos.unshift(transacao);
      this.atualizarBalance();
      this.fecharModal();
    } else {
      console.log('Formulário inválido');
    }
  }

  removerTransacao(index: number) {
    this.movimentos.splice(index, 1);
    this.atualizarBalance();
  }

  private atualizarBalance() {
    this.saveMovimentos();
    this.balance.setEntrada(this.totalEntradas());
    this.balance.setSaida(this.totalSaidas());
  }

  private totalSaidas(): number {
    return this.movimentos
      .filter(m => m.tipo === 'gasto')
      .reduce((soma, m) => soma + m.valor, 0);
  }

  private totalEntradas(): number {
    return this.movimentos
      .filter(m => m.tipo === 'entrada')
      .reduce((soma, m) => soma + m.valor, 0);
  }

  private loadMovimentos() {
    try {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  }

  private saveMovimentos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.movimentos));
  }
}
