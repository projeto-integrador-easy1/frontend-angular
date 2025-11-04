import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../../services/balance.service';

@Component({
  standalone: true,
  selector: 'app-gastos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {
  private readonly STORAGE_KEY = 'movimentos';
  movimentos: Array<{ tipo: 'gasto' | 'entrada'; nome: string; descricao: string; valor: number }> = [];
  mostrarModal = false;
  novoGasto = { tipo: 'gasto' as 'gasto' | 'entrada', nome: '', descricao: '', valor: null as number | null };

  constructor(private balance: BalanceService) {}

  ngOnInit(): void {
    this.movimentos = this.loadMovimentos();
    this.balance.setEntrada(this.totalEntradas());
    this.balance.setSaida(this.totalSaidas());
  }

  abrirModal() {
    this.novoGasto = { tipo: 'gasto', nome: '', descricao: '', valor: null };
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  criarGasto() {
    if (!this.novoGasto.nome || this.novoGasto.valor == null) return;
    const valor = Number(this.novoGasto.valor);
    this.movimentos.unshift({
      tipo: this.novoGasto.tipo,
      nome: this.novoGasto.nome.toUpperCase(),
      descricao: this.novoGasto.descricao,
      valor
    });
    this.saveMovimentos();
    this.balance.setEntrada(this.totalEntradas());
    this.balance.setSaida(this.totalSaidas());
    this.fecharModal();
  }

  removerGasto(index: number) {
    this.movimentos.splice(index, 1);
    this.saveMovimentos();
    this.balance.setEntrada(this.totalEntradas());
    this.balance.setSaida(this.totalSaidas());
  }

  private totalSaidas(): number {
    return this.movimentos
      .filter(m => m.tipo === 'gasto')
      .reduce((soma, m) => soma + (Number(m.valor) || 0), 0);
  }

  private totalEntradas(): number {
    return this.movimentos
      .filter(m => m.tipo === 'entrada')
      .reduce((soma, m) => soma + (Number(m.valor) || 0), 0);
  }

  private loadMovimentos(): Array<{ tipo: 'gasto' | 'entrada'; nome: string; descricao: string; valor: number }> {
    try {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      const lista = salvo ? JSON.parse(salvo) : [];
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  }

  private saveMovimentos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.movimentos));
  }
}
