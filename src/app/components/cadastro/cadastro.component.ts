import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  standalone: true,
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  formCadastro: FormGroup;
  mensagemErro = '';
  mensagemSucesso = '';
  carregando = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.formCadastro = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  cadastrar(): void {
    if (this.formCadastro.invalid) {
      this.mensagemErro = 'Preencha todos os campos corretamente.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    const { nome, email, senha } = this.formCadastro.value;

    this.usuarioService.cadastrar(nome, email, senha).subscribe({
      next: (usuario) => {
        this.carregando = false;
        if (usuario) {
          this.mensagemSucesso = 'Cadastro realizado!';
          setTimeout(() => this.router.navigate(['/geral']), 1000);
        } else {
          this.mensagemErro = 'Erro ao cadastrar.';
        }
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Erro ao cadastrar.';
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
