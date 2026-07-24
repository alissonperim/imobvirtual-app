import type { ChamadoStatus, CobrancaStatus, ContratoStatus, ImovelStatus } from '../lib/types';

const IMOVEL_MAP: Record<ImovelStatus, { label: string; cls: string }> = {
  ocupado: { label: 'Ocupado', cls: 'st-paid' },
  vago: { label: 'Vago', cls: 'tag-neutral' },
  atraso: { label: 'Em atraso', cls: 'st-late' },
  a_vencer: { label: 'Contrato a vencer', cls: 'st-pend' },
};

const CONTRATO_MAP: Record<ContratoStatus, { label: string; cls: string }> = {
  ativo: { label: 'Ativo', cls: 'st-paid' },
  aguardando_assinatura: { label: 'Aguardando assinatura', cls: 'tag-outline' },
  renovacao_pendente: { label: 'Renovação pendente', cls: 'st-pend' },
  encerrado: { label: 'Encerrado', cls: 'tag-neutral' },
};

const COBRANCA_MAP: Record<CobrancaStatus, { label: string; cls: string }> = {
  pago: { label: 'Pago', cls: 'st-paid' },
  pendente: { label: 'A vencer', cls: 'st-pend' },
  atrasado: { label: 'Em atraso', cls: 'st-late' },
  cancelado: { label: 'Cancelado', cls: 'tag-neutral' },
};

const CHAMADO_MAP: Record<ChamadoStatus, { label: string; cls: string }> = {
  aberto: { label: 'Aberto', cls: 'tag-outline' },
  em_analise: { label: 'Em análise', cls: 'st-pend' },
  resolvido: { label: 'Resolvido', cls: 'st-paid' },
};

function Tag({ label, cls }: { label: string; cls: string }) {
  return <span className={`tag ${cls}`}>{label}</span>;
}

export function ImovelStatusTag({ status }: { status: ImovelStatus }) {
  const m = IMOVEL_MAP[status];
  return <Tag {...m} />;
}
export function ContratoStatusTag({ status }: { status: ContratoStatus }) {
  const m = CONTRATO_MAP[status];
  return <Tag {...m} />;
}
export function CobrancaStatusTag({ status }: { status: CobrancaStatus }) {
  const m = COBRANCA_MAP[status];
  return <Tag {...m} />;
}
export function ChamadoStatusTag({ status }: { status: ChamadoStatus }) {
  const m = CHAMADO_MAP[status];
  return <Tag {...m} />;
}
