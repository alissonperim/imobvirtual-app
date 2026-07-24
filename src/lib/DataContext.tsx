import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALERTAS, CHAMADOS, CONTRATOS, COBRANCAS, IMOVEIS, INQUILINOS_NOMES } from './mockData';
import type {
  Alerta, Chamado, ChamadoCategoria, ChamadoUrgencia, Contrato, Cobranca, Imovel, MetodoPagamento,
} from './types';

const STORAGE_KEY = 'imobvirtual:data:v1';

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
    (id: string | null) => (id ? INQUILINOS_NOMES[id] ?? id : '—'),
    [],
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
    setState((prev) => ({
      ...prev,
      contratos: prev.contratos.map((c) =>
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
      ),
    }));
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
