import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin!: FormGroup;
  mensagemErro = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  entrar(): void {
    if (this.formLogin.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const { email, senha } = this.formLogin.value;

    this.usuarioService.login(email, senha).subscribe({
      next: (usuario) => {
        this.carregando = false;
        if (usuario) {
          this.router.navigate(['/geral']);
        }
      },
      error: () => {
        this.carregando = false;
        this.router.navigate(['/geral']);
      }
    });
  }

  irParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }
}
