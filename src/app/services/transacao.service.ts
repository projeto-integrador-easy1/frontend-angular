import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transacao } from '../models/transacao.model';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private readonly apiUrl = '/transacao';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  criarTransacao(transacao: Transacao): Observable<unknown> {
    return this.http.post(this.apiUrl, transacao, this.httpOptions);
  }

  buscarTodasTransacoes(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.apiUrl, this.httpOptions);
  }

  buscarTransacoesPorUsuario(usuarioId: number): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(`${this.apiUrl}?usuarioId=${usuarioId}`, this.httpOptions);
  }

  deletarTransacao(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}

