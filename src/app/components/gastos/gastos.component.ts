import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-gastos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent {
  gastos = [
    { nome: 'ACADEMIA', descricao: 'Mensalidade', valor: 120.00 },
    { nome: 'FARMÁCIA', descricao: 'Medicamentos', valor: 150.00 }
  ];
  mostrarModal = false;
  novoGasto = { nome: '', descricao: '', valor: null as number | null };

  abrirModal() {
    this.novoGasto = { nome: '', descricao: '', valor: null };
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  criarGasto() {
    if (!this.novoGasto.nome || this.novoGasto.valor == null) return;
    this.gastos.unshift({
      nome: this.novoGasto.nome.toUpperCase(),
      descricao: this.novoGasto.descricao,
      valor: Number(this.novoGasto.valor)
    });
    this.fecharModal();
  }

  removerGasto(index: number) {
    this.gastos.splice(index, 1);
  }
}
