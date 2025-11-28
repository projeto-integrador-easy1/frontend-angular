import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = '/usuario';
  private usuarioLogado: Usuario | null = null;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(catchError(() => of([])));
  }

  login(email: string, senha: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map((usuarios) => {
        const usuarioEncontrado = usuarios.find(
          (u) => u.email === email && u.senha === senha
        );
        
        if (usuarioEncontrado) {
          this.usuarioLogado = usuarioEncontrado;
          return usuarioEncontrado;
        }
        
        return null;
      }),
      catchError(() => of(null))
    );
  }

  cadastrar(nome: string, email: string, senha: string): Observable<Usuario | null> {
    return this.http.post<Usuario>(this.apiUrl, { nome, email, senha }).pipe(
      map((usuario) => {
        if (usuario) {
          this.usuarioLogado = usuario;
        }
        return usuario;
      }),
      catchError(() => of(null))
    );
  }

  getUsuarioLogado(): Usuario | null {
    return this.usuarioLogado;
  }

  logout(): void {
    this.usuarioLogado = null;
  }

  isLogado(): boolean {
    return this.getUsuarioLogado() !== null;
  }
}
