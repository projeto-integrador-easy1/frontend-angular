import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transacao } from '../models/transacao.model';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private apiUrl = '/transacao';

  constructor(private http: HttpClient) { }

  criar(transacao: Transacao): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, transacao);
  }

  buscarTodas(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.apiUrl);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, transacao: Transacao): Observable<Transacao> {
    return this.http.put<Transacao>(`${this.apiUrl}/${id}`, transacao);
  }
}
