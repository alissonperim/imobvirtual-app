import type {
  Alerta,
  Chamado,
  Contrato,
  Cobranca,
  Imovel,
  User,
} from "./types";

export const DEMO_OWNER: User = {
  id: "u-ricardo",
  nome: "Ricardo",
  sobrenome: "Souza",
  email: "ricardo.souza@email.com",
  telefone: "(11) 99876-5432",
  role: "proprietario",
  canalPreferido: "whatsapp",
  documento: "412.556.900-11",
  iniciais: "RS",
};

export const DEMO_TENANT: User = {
  id: "u-mariana",
  nome: "Mariana",
  sobrenome: "Alves",
  email: "mariana.alves@email.com",
  telefone: "(11) 98812-4477",
  role: "inquilino",
  canalPreferido: "sms",
  documento: "385.220.418-90",
  iniciais: "MA",
};

export const DEMO_USERS: User[] = [DEMO_OWNER, DEMO_TENANT];

export const IMOVEIS: Imovel[] = [
  {
    id: "im-harmonia",
    endereco: "Rua Harmonia, 452",
    bairro: "Vila Madalena",
    cidade: "São Paulo, SP",
    tipo: "Apto · 2 quartos",
    metragem: 68,
    aluguel: 3200,
    diaVencimento: 8,
    inquilinoId: "u-mariana",
    status: "atraso",
  },
  {
    id: "im-paulista",
    endereco: "Av. Paulista, 1000",
    bairro: "Bela Vista",
    cidade: "São Paulo, SP",
    tipo: "Sala comercial",
    metragem: 42,
    aluguel: 5800,
    diaVencimento: 10,
    inquilinoId: "inq-studio-reali",
    status: "ocupado",
  },
  {
    id: "im-palmeiras",
    endereco: "Rua das Palmeiras, 88",
    bairro: "Pinheiros",
    cidade: "São Paulo, SP",
    tipo: "Casa · 3 quartos",
    metragem: 140,
    aluguel: 4500,
    diaVencimento: 15,
    inquilinoId: "inq-carlos-mendes",
    status: "a_vencer",
  },
  {
    id: "im-aurora",
    endereco: "Rua Aurora, 210",
    bairro: "Santa Cecília",
    cidade: "São Paulo, SP",
    tipo: "Kitnet",
    metragem: 28,
    aluguel: 1900,
    diaVencimento: 5,
    inquilinoId: null,
    status: "vago",
  },
];

export const INQUILINOS_NOMES: Record<string, string> = {
  "u-mariana": "Mariana Alves",
  "inq-studio-reali": "Studio Reali",
  "inq-carlos-mendes": "Carlos Mendes",
};

export const CONTRATOS: Contrato[] = [
  {
    id: "ct-harmonia-mariana",
    imovelId: "im-harmonia",
    inquilinoNome: "Mariana Alves",
    inquilinoId: "u-mariana",
    valor: 3200,
    status: "ativo",
    inicio: "01/03/2025",
    vigenciaMeses: 12,
    indiceReajuste: "IGP-M",
    proximoReajuste: "03/2026",
    assinadoPeloInquilino: true,
    eventos: [
      { titulo: "Contrato enviado", data: "01/03/2025 09:20", concluido: true },
      {
        titulo: "Assinado pelo inquilino",
        data: "01/03/2025 14:05",
        detalhe: "CPF ***.418.220-**",
        concluido: true,
      },
      {
        titulo: "Contrato ativo",
        data: "Registrado com validade jurídica",
        concluido: true,
      },
    ],
  },
  {
    id: "ct-paulista-reali",
    imovelId: "im-paulista",
    inquilinoNome: "Studio Reali",
    inquilinoId: "inq-studio-reali",
    valor: 5800,
    status: "ativo",
    inicio: "15/01/2024",
    vigenciaMeses: 24,
    indiceReajuste: "IPCA",
    proximoReajuste: "01/2026",
    assinadoPeloInquilino: true,
    eventos: [
      { titulo: "Contrato enviado", data: "10/01/2024 11:00", concluido: true },
      {
        titulo: "Assinado pelo inquilino",
        data: "12/01/2024 16:40",
        detalhe: "CNPJ ***.221.400/**",
        concluido: true,
      },
      {
        titulo: "Contrato ativo",
        data: "Registrado com validade jurídica",
        concluido: true,
      },
    ],
  },
  {
    id: "ct-palmeiras-carlos",
    imovelId: "im-palmeiras",
    inquilinoNome: "Carlos Mendes",
    inquilinoId: "inq-carlos-mendes",
    valor: 4500,
    status: "renovacao_pendente",
    inicio: "01/08/2024",
    vigenciaMeses: 12,
    indiceReajuste: "IGP-M",
    proximoReajuste: "08/2025",
    assinadoPeloInquilino: true,
    eventos: [
      { titulo: "Contrato enviado", data: "28/07/2024 10:15", concluido: true },
      {
        titulo: "Assinado pelo inquilino",
        data: "29/07/2024 09:30",
        detalhe: "CPF ***.902.115-**",
        concluido: true,
      },
      {
        titulo: "Renovação pendente",
        data: "Vence em 22 dias",
        concluido: false,
      },
    ],
  },
  {
    id: "ct-aurora-novo",
    imovelId: "im-aurora",
    inquilinoNome: "Novo contrato",
    inquilinoId: null,
    valor: 1900,
    status: "aguardando_assinatura",
    inicio: "—",
    vigenciaMeses: 12,
    indiceReajuste: "IGP-M",
    proximoReajuste: "—",
    assinadoPeloInquilino: false,
    eventos: [
      {
        titulo: "Contrato enviado",
        data: "Aguardando assinatura",
        concluido: true,
      },
      { titulo: "Assinatura do inquilino", data: "Pendente", concluido: false },
      { titulo: "Contrato ativo", data: "Pendente", concluido: false },
    ],
  },
  {
    id: "ct-harmonia-fernanda",
    imovelId: "im-harmonia",
    inquilinoNome: "Fernanda Lima",
    inquilinoId: null,
    valor: 2950,
    status: "encerrado",
    inicio: "01/02/2024",
    vigenciaMeses: 12,
    indiceReajuste: "IGP-M",
    proximoReajuste: "—",
    assinadoPeloInquilino: true,
    eventos: [
      { titulo: "Contrato enviado", data: "25/01/2024", concluido: true },
      {
        titulo: "Assinado pelo inquilino",
        data: "27/01/2024",
        concluido: true,
      },
      { titulo: "Contrato encerrado", data: "01/02/2025", concluido: true },
    ],
  },
];

export const COBRANCAS: Cobranca[] = [
  {
    id: "cb-harmonia-jun",
    imovelId: "im-harmonia",
    inquilinoId: "u-mariana",
    inquilinoNome: "Mariana Alves",
    competencia: "Jun/2025",
    vencimento: "08/06/2025",
    valor: 3200,
    metodo: null,
    status: "atrasado",
    diasEmAtraso: 12,
  },
  {
    id: "cb-harmonia-jul",
    imovelId: "im-harmonia",
    inquilinoId: "u-mariana",
    inquilinoNome: "Mariana Alves",
    competencia: "Jul/2025",
    vencimento: "08/07/2025",
    valor: 3200,
    metodo: null,
    status: "pendente",
    diasParaVencer: 3,
  },
  {
    id: "cb-paulista-jun",
    imovelId: "im-paulista",
    inquilinoId: "inq-studio-reali",
    inquilinoNome: "Studio Reali",
    competencia: "Jun/2025",
    vencimento: "10/06/2025",
    valor: 5800,
    metodo: "boleto",
    status: "pago",
    pagoEm: "10/06/2025",
  },
  {
    id: "cb-paulista-jul",
    imovelId: "im-paulista",
    inquilinoId: "inq-studio-reali",
    inquilinoNome: "Studio Reali",
    competencia: "Jul/2025",
    vencimento: "10/07/2025",
    valor: 5800,
    metodo: "boleto",
    status: "pago",
    pagoEm: "hoje 09:12",
  },
  {
    id: "cb-palmeiras-jul",
    imovelId: "im-palmeiras",
    inquilinoId: "inq-carlos-mendes",
    inquilinoNome: "Carlos Mendes",
    competencia: "Jul/2025",
    vencimento: "15/07/2025",
    valor: 4500,
    metodo: "pix",
    status: "pendente",
    diasParaVencer: 10,
  },
];

export const CHAMADOS: Chamado[] = [
  {
    id: "ch-vazamento",
    imovelId: "im-harmonia",
    inquilinoId: "u-mariana",
    categoria: "Hidráulica",
    urgencia: "Média",
    descricao: "Vazamento embaixo da pia da cozinha, pingando desde ontem.",
    status: "em_analise",
    criadoEm: "21/07/2025",
    fotos: [],
    mensagens: [
      {
        autor: "Mariana Alves",
        texto: "Vazamento embaixo da pia da cozinha, pingando desde ontem.",
        data: "21/07/2025 08:14",
      },
      {
        autor: "Ricardo Souza",
        texto:
          "Obrigado pelo aviso, já acionei o encanador. Deve passar aí amanhã.",
        data: "21/07/2025 12:40",
      },
    ],
  },
];

export const ALERTAS: Alerta[] = [
  {
    id: "al-1",
    cor: "danger",
    titulo: "Aluguel de junho de Mariana Alves em atraso",
    detalhe: "Rua Harmonia, 452 · há 12 dias",
  },
  {
    id: "al-2",
    cor: "accent",
    titulo: "Contrato de Carlos Mendes vence em 22 dias",
    detalhe: "Renovação pendente · Rua das Palmeiras, 88",
  },
  {
    id: "al-3",
    cor: "neutral",
    titulo: "Novo chamado: vazamento na pia",
    detalhe: "Rua Harmonia, 452 · urgência média",
  },
  {
    id: "al-4",
    cor: "accent-2",
    titulo: "Pagamento recebido de Studio Reali",
    detalhe: "R$ 5.800 via boleto · hoje 09:12",
  },
];

export function nomeCompleto(u: User) {
  return `${u.nome} ${u.sobrenome}`;
}
