export type Role = 'proprietario' | 'inquilino';

export type Channel = 'sms' | 'whatsapp' | 'email';

export interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  role: Role;
  canalPreferido: Channel;
  documento: string; // CPF ou CNPJ
  iniciais: string;
}

export type ImovelStatus = 'ocupado' | 'vago' | 'atraso' | 'a_vencer';

export interface Imovel {
  id: string;
  endereco: string;
  bairro: string;
  cidade: string;
  tipo: string;
  metragem: number;
  aluguel: number;
  diaVencimento: number;
  inquilinoId: string | null;
  status: ImovelStatus;
}

export type ContratoStatus = 'ativo' | 'aguardando_assinatura' | 'renovacao_pendente' | 'encerrado';

export interface ContratoEvento {
  titulo: string;
  data: string;
  detalhe?: string;
  concluido: boolean;
}

export interface Contrato {
  id: string;
  imovelId: string;
  inquilinoNome: string;
  inquilinoId: string | null;
  valor: number;
  status: ContratoStatus;
  inicio: string;
  vigenciaMeses: number;
  indiceReajuste: string;
  proximoReajuste: string;
  eventos: ContratoEvento[];
  assinadoPeloInquilino: boolean;
}

export type CobrancaStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado';
export type MetodoPagamento = 'pix' | 'boleto' | null;

export interface Cobranca {
  id: string;
  imovelId: string;
  inquilinoId: string;
  inquilinoNome: string;
  competencia: string; // "Jul/2025"
  vencimento: string; // "08/07/2025"
  valor: number;
  metodo: MetodoPagamento;
  status: CobrancaStatus;
  diasEmAtraso?: number;
  diasParaVencer?: number;
  pagoEm?: string;
  // Encargos repassados junto com o aluguel (condomínio, IPTU etc.) — "Aluguel" na
  // fatura é a diferença entre `valor` e a soma destes. Sem isso, a fatura é só aluguel.
  encargos?: { label: string; valor: number }[];
}

export type ChamadoCategoria = 'Hidráulica' | 'Elétrica' | 'Estrutura' | 'Outros';
export type ChamadoUrgencia = 'Baixa' | 'Média' | 'Alta';
export type ChamadoStatus = 'aberto' | 'em_analise' | 'resolvido';

export interface ChamadoMensagem {
  autor: string;
  texto: string;
  data: string;
}

export interface Chamado {
  id: string;
  imovelId: string;
  inquilinoId: string;
  categoria: ChamadoCategoria;
  urgencia: ChamadoUrgencia;
  descricao: string;
  status: ChamadoStatus;
  criadoEm: string;
  fotos: string[];
  mensagens: ChamadoMensagem[];
}

export interface Alerta {
  id: string;
  cor: 'danger' | 'accent' | 'neutral' | 'accent-2';
  titulo: string;
  detalhe: string;
}
