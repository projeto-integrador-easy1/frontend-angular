import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = '/usuario';
  usuarioLogado: Usuario | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map((usuarios) => {
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        if (usuario) this.usuarioLogado = usuario;
        return usuario || null;
      }),
      catchError(() => of(null))
    );
  }

  cadastrar(nome: string, email: string, senha: string): Observable<Usuario | null> {
    return this.http.post<Usuario>(this.apiUrl, { nome, email, senha }).pipe(
      map((usuario) => {
        if (usuario) this.usuarioLogado = usuario;
        return usuario;
      }),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.usuarioLogado = null;
  }
}
