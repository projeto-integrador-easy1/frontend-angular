export type TipoTransacao = 'gasto' | 'entrada' | 'Despesa' | 'Receita';

export interface Transacao {
  id?: number;
  nome: string;
  tipo: TipoTransacao;
  valor: number;
  data: string;
  descricao: string;
  usuario: {
    id: number;
  };
}

