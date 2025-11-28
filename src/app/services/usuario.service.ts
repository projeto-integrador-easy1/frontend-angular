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
    const usuario: Usuario = { nome: email.split('@')[0], email, id: Date.now() };
    this.usuarioLogado = usuario;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    return of(usuario);
  }

  cadastrar(nome: string, email: string, senha: string): Observable<Usuario | null> {
    return this.http.post<Usuario>(this.apiUrl, { nome, email, senha }).pipe(
      map((usuario) => {
        if (usuario) {
          this.usuarioLogado = usuario;
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        }
        return usuario;
      }),
      catchError(() => {
        const usuarioLocal: Usuario = { nome, email, id: Date.now() };
        this.usuarioLogado = usuarioLocal;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLocal));
        return of(usuarioLocal);
      })
    );
  }

  getUsuarioLogado(): Usuario | null {
    if (!this.usuarioLogado) {
      const usuarioStorage = localStorage.getItem('usuarioLogado');
      if (usuarioStorage) {
        this.usuarioLogado = JSON.parse(usuarioStorage);
      }
    }
    return this.usuarioLogado;
  }

  logout(): void {
    this.usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
  }

  isLogado(): boolean {
    return this.getUsuarioLogado() !== null;
  }
}
