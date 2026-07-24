import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALERTAS, CHAMADOS, CONTRATOS, COBRANCAS, IMOVEIS, INQUILINOS_NOMES } from './mockData';
import { useAuth } from './AuthContext';
import type {
  Alerta, Chamado, ChamadoCategoria, ChamadoUrgencia, Contrato, Cobranca, Imovel, MetodoPagamento,
} from './types';

const STORAGE_KEY = 'imobvirtual:data:v1';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function competenciaAtual(): string {
  const d = new Date();
  return `${MESES[d.getMonth()]}/${d.getFullYear()}`;
}

function dataBRDaquiA(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

interface DataState {
  imoveis: Imovel[];
  contratos: Contrato[];
  cobrancas: Cobranca[];
  chamados: Chamado[];
  alertas: Alerta[];
}

function loadInitial(): DataState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DataState;
    } catch {
      // ignore corrupted storage
    }
  }
  return { imoveis: IMOVEIS, contratos: CONTRATOS, cobrancas: COBRANCAS, chamados: CHAMADOS, alertas: ALERTAS };
}

interface DataContextValue extends DataState {
  inquilinoNome: (id: string | null) => string;
  imovelById: (id: string) => Imovel | undefined;
  contratoById: (id: string) => Contrato | undefined;
  cobrancasByInquilino: (inquilinoId: string) => Cobranca[];
  contratoByInquilino: (inquilinoId: string) => Contrato | undefined;
  chamadosByInquilino: (inquilinoId: string) => Chamado[];
  payCobranca: (id: string, metodo: Exclude<MetodoPagamento, null>) => void;
  signContrato: (id: string) => void;
  addChamado: (input: { imovelId: string; inquilinoId: string; categoria: ChamadoCategoria; urgencia: ChamadoUrgencia; descricao: string; fotos: string[] }) => Chamado;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(loadInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const inquilinoNome = useCallback(
    (id: string | null) => {
      if (!id) return '—';
      const contrato = state.contratos.find((c) => c.inquilinoId === id);
      return contrato?.inquilinoNome ?? INQUILINOS_NOMES[id] ?? id;
    },
    [state.contratos],
  );

  const imovelById = useCallback((id: string) => state.imoveis.find((i) => i.id === id), [state.imoveis]);
  const contratoById = useCallback((id: string) => state.contratos.find((c) => c.id === id), [state.contratos]);
  const cobrancasByInquilino = useCallback(
    (inquilinoId: string) => state.cobrancas.filter((c) => c.inquilinoId === inquilinoId),
    [state.cobrancas],
  );
  const contratoByInquilino = useCallback(
    (inquilinoId: string) => state.contratos.find((c) => c.inquilinoId === inquilinoId),
    [state.contratos],
  );
  const chamadosByInquilino = useCallback(
    (inquilinoId: string) => state.chamados.filter((c) => c.inquilinoId === inquilinoId),
    [state.chamados],
  );

  const payCobranca = useCallback((id: string, metodo: Exclude<MetodoPagamento, null>) => {
    setState((prev) => {
      const cobrancas = prev.cobrancas.map((c) =>
        c.id === id ? { ...c, status: 'pago' as const, metodo, pagoEm: 'agora há pouco', diasEmAtraso: undefined, diasParaVencer: undefined } : c,
      );
      const paidCharge = prev.cobrancas.find((c) => c.id === id);
      let imoveis = prev.imoveis;
      if (paidCharge) {
        const stillLate = cobrancas.some((c) => c.imovelId === paidCharge.imovelId && c.status === 'atrasado');
        if (!stillLate) {
          imoveis = prev.imoveis.map((i) =>
            i.id === paidCharge.imovelId && i.status === 'atraso' ? { ...i, status: 'ocupado' as const } : i,
          );
        }
      }
      return { ...prev, cobrancas, imoveis };
    });
  }, []);

  const signContrato = useCallback((id: string) => {
    setState((prev) => {
      const contrato = prev.contratos.find((c) => c.id === id);
      if (!contrato) return prev;

      const contratos = prev.contratos.map((c) =>
        c.id === id
          ? {
              ...c,
              assinadoPeloInquilino: true,
              status: 'ativo' as const,
              eventos: c.eventos.map((e) =>
                e.concluido ? e : { ...e, concluido: true, data: 'agora há pouco' },
              ),
            }
          : c,
      );

      const imoveis = prev.imoveis.map((i) =>
        i.id === contrato.imovelId && i.status === 'vago' ? { ...i, status: 'ocupado' as const } : i,
      );

      const jaTemCobranca = contrato.inquilinoId
        ? prev.cobrancas.some((cb) => cb.inquilinoId === contrato.inquilinoId)
        : true;
      const cobrancas = jaTemCobranca
        ? prev.cobrancas
        : [
            {
              id: `cb-${contrato.imovelId}-${Date.now()}`,
              imovelId: contrato.imovelId,
              inquilinoId: contrato.inquilinoId!,
              inquilinoNome: contrato.inquilinoNome,
              competencia: competenciaAtual(),
              vencimento: dataBRDaquiA(7),
              valor: contrato.valor,
              metodo: null,
              status: 'pendente' as const,
              diasParaVencer: 7,
            },
            ...prev.cobrancas,
          ];

      return { ...prev, contratos, imoveis, cobrancas };
    });
  }, []);

  const addChamado = useCallback(
    (input: { imovelId: string; inquilinoId: string; categoria: ChamadoCategoria; urgencia: ChamadoUrgencia; descricao: string; fotos: string[] }) => {
      const novo: Chamado = {
        id: `ch-${Date.now()}`,
        status: 'aberto',
        criadoEm: 'agora há pouco',
        mensagens: [{ autor: 'Você', texto: input.descricao, data: 'agora há pouco' }],
        ...input,
      };
      setState((prev) => ({ ...prev, chamados: [novo, ...prev.chamados] }));
      return novo;
    },
    [],
  );

  // Recém-cadastrados não vêm com nada no dataset demo (id gerado na hora). Assim que um
  // inquilino sem contrato aparece, ele "assume" a unidade de exemplo que já existe pronta
  // para isso (contrato aguardando assinatura, sem inquilino vinculado); se essa unidade já
  // tiver sido reclamada por outro cadastro nesta mesma sessão, gera uma nova do zero.
  const ensureTenantOnboarded = useCallback((user: { id: string; nome: string; sobrenome: string }) => {
    setState((prev) => {
      if (prev.contratos.some((c) => c.inquilinoId === user.id)) return prev;

      const nomeCompleto = `${user.nome} ${user.sobrenome}`.trim();
      const placeholder = prev.contratos.find((c) => c.status === 'aguardando_assinatura' && c.inquilinoId === null);

      if (placeholder) {
        return {
          ...prev,
          contratos: prev.contratos.map((c) =>
            c.id === placeholder.id ? { ...c, inquilinoId: user.id, inquilinoNome: nomeCompleto } : c,
          ),
          imoveis: prev.imoveis.map((i) =>
            i.id === placeholder.imovelId ? { ...i, inquilinoId: user.id } : i,
          ),
        };
      }

      const imovelId = `im-novo-${user.id}`;
      const novoImovel: Imovel = {
        id: imovelId,
        endereco: 'Rua dos Ipês, 120',
        bairro: 'Perdizes',
        cidade: 'São Paulo, SP',
        tipo: 'Apto · 1 quarto',
        metragem: 45,
        aluguel: 2400,
        diaVencimento: 10,
        inquilinoId: user.id,
        status: 'vago',
      };
      const novoContrato: Contrato = {
        id: `ct-novo-${user.id}`,
        imovelId,
        inquilinoNome: nomeCompleto,
        inquilinoId: user.id,
        valor: 2400,
        status: 'aguardando_assinatura',
        inicio: '—',
        vigenciaMeses: 12,
        indiceReajuste: 'IGP-M',
        proximoReajuste: '—',
        assinadoPeloInquilino: false,
        eventos: [
          { titulo: 'Contrato enviado', data: 'Aguardando assinatura', concluido: true },
          { titulo: 'Assinatura do inquilino', data: 'Pendente', concluido: false },
          { titulo: 'Contrato ativo', data: 'Pendente', concluido: false },
        ],
      };
      return { ...prev, imoveis: [...prev.imoveis, novoImovel], contratos: [...prev.contratos, novoContrato] };
    });
  }, []);

  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser?.role === 'inquilino') ensureTenantOnboarded(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const resetDemoData = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({ imoveis: IMOVEIS, contratos: CONTRATOS, cobrancas: COBRANCAS, chamados: CHAMADOS, alertas: ALERTAS });
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      ...state,
      inquilinoNome,
      imovelById,
      contratoById,
      cobrancasByInquilino,
      contratoByInquilino,
      chamadosByInquilino,
      payCobranca,
      signContrato,
      addChamado,
      resetDemoData,
    }),
    [state, inquilinoNome, imovelById, contratoById, cobrancasByInquilino, contratoByInquilino, chamadosByInquilino, payCobranca, signContrato, addChamado, resetDemoData],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
