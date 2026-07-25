import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Copy, Download } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import { formatBRL } from '../../lib/format';
import SegmentedControl from '../../components/SegmentedControl';
import BackHeader from './BackHeader';
import styles from './TenantPages.module.css';

const PIX_KEY = '00020126580014BR.GOV.BCB.PIX0136a629...5303986BR';
const BOLETO_LINE = '34191.79001 01043.510047 91020.150008 8 98770000320000';

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function PaymentPage() {
  const { currentUser } = useAuth();
  const { cobrancasByInquilino, imovelById, payCobranca } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState<'pix' | 'boleto'>('pix');
  const [secondsLeft, setSecondsLeft] = useState(29 * 60 + 41);

  useEffect(() => {
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!currentUser) return null;

  const cobranca = cobrancasByInquilino(currentUser.id).find((c) => c.status !== 'pago');
  const imovel = cobranca ? imovelById(cobranca.imovelId) : undefined;

  if (!cobranca) {
    return (
      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className={styles.mobileOnly}><BackHeader title="Pagar aluguel" to="/app" /></div>
        <div className={styles.header}><h3 style={{ fontSize: 22, margin: 0 }}>Pagar aluguel</h3></div>
        <p className="text-muted">Nenhuma cobrança em aberto no momento. Você está em dia! 🎉</p>
      </div>
    );
  }

  const encargos = cobranca.encargos ?? [];
  const aluguelBase = cobranca.valor - encargos.reduce((s, e) => s + e.valor, 0);

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast(`${label} copiado para a área de transferência.`);
  }

  function simularPagamento() {
    payCobranca(cobranca!.id, metodo);
    showToast('Pagamento confirmado com sucesso!');
    navigate('/app');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={styles.mobileOnly}><BackHeader title="Pagar aluguel" to="/app" /></div>
      <div className={styles.header} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 0 }}>
        <h3 style={{ fontSize: 22, margin: 0 }}>Pagar aluguel</h3>
        <span className="tag st-pend">Aluguel de {competenciaExtenso(cobranca.competencia)}</span>
      </div>

      <div className={styles.payGrid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card elev-sm" style={{ padding: 20, gap: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Resumo da cobrança</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Aluguel</span><span>{formatBRL(aluguelBase)}</span></div>
              {encargos.map((e) => (
                <div key={e.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">{e.label}</span><span>{formatBRL(e.valor)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-divider)', paddingTop: 9, fontWeight: 700, fontSize: 16 }}>
                <span>Total</span><span>{formatBRL(cobranca.valor)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-surface)', borderRadius: 12, padding: '10px 12px', fontSize: 12 }}>
              <Clock size={15} color="var(--color-accent-700)" strokeWidth={2.5} />
              {cobranca.status === 'atrasado' ? (
                <span>Venceu em <strong>{cobranca.vencimento}</strong> · {cobranca.diasEmAtraso} dias em atraso</span>
              ) : (
                <span>Vence em <strong>{cobranca.vencimento}</strong> · sem multa até a data</span>
              )}
            </div>
          </div>

          <div className="card elev-sm" style={{ padding: 20, gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Forma de pagamento</span>
            <SegmentedControl
              name="pay"
              value={metodo}
              onChange={setMetodo}
              options={[{ value: 'pix', label: 'PIX' }, { value: 'boleto', label: 'Boleto' }]}
            />
            <div className="text-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              {metodo === 'pix'
                ? <>Escaneie o QR Code no app do seu banco ou copie o código PIX.</>
                : <>Gere o boleto e pague em qualquer banco ou app.</>} A confirmação do pagamento é{' '}
              <strong style={{ color: 'var(--color-text)' }}>automática</strong> — você recebe o comprovante na hora.
            </div>
          </div>
        </div>

        <div className="card elev-sm" style={{ padding: 28, gap: 18, alignItems: 'center', textAlign: 'center' }}>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>Pague com {metodo === 'pix' ? 'PIX' : 'boleto'}</div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-.01em' }}>{formatBRL(cobranca.valor)}</div>
            {imovel && <div className="text-muted" style={{ fontSize: 11 }}>{imovel.endereco}</div>}
          </div>

          {metodo === 'pix' ? (
            <>
              <div style={{ background: '#fff', border: '1px solid var(--color-divider)', borderRadius: 18, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
                <PixQr />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--color-accent-700)', fontWeight: 600 }}>
                <Clock size={14} strokeWidth={2.5} /> Expira em {formatMMSS(secondsLeft)}
              </div>
              <button
                className="btn btn-secondary btn-block"
                style={{ minHeight: 44, justifyContent: 'space-between', paddingInline: 16, marginTop: 0, width: '100%' }}
                onClick={() => copy(PIX_KEY, 'Chave PIX')}
              >
                <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-neutral-600)' }}>
                  00020126…5303986BR
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-accent-700)', flex: 'none', fontWeight: 600 }}>
                  <Copy size={15} strokeWidth={2.5} /> Copiar
                </span>
              </button>
            </>
          ) : (
            <>
              <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-accent-2)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Download size={18} color="#fff" strokeWidth={2.5} />
                </div>
                <div style={{ lineHeight: 1.3 }}>
                  <div className="text-muted" style={{ fontSize: 12 }}>Vencimento</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{cobranca.vencimento}</div>
                </div>
              </div>
              <div style={{ width: '100%', textAlign: 'left' }}>
                <div className="text-muted" style={{ fontSize: 11, marginBottom: 5 }}>Linha digitável</div>
                <div style={{ background: '#fff', border: '1px solid var(--color-divider)', borderRadius: 12, padding: '11px 12px', fontSize: 11, fontFamily: 'ui-monospace,monospace', letterSpacing: '.02em', lineHeight: 1.5 }}>
                  {BOLETO_LINE}
                </div>
              </div>
              <Barcode />
              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                <button className="btn btn-secondary" style={{ flex: 1, minHeight: 44 }} onClick={() => showToast('Boleto disponível para download (simulado).')}>
                  <Download size={15} strokeWidth={2.5} /> PDF
                </button>
                <button className="btn btn-primary" style={{ flex: 2, minHeight: 44 }} onClick={() => copy(BOLETO_LINE, 'Código do boleto')}>
                  <Copy size={15} strokeWidth={2.5} /> Copiar código
                </button>
              </div>
              <div className="text-muted" style={{ fontSize: 11 }}>Compensação em até 2 dias úteis após o pagamento.</div>
            </>
          )}
        </div>
      </div>

      <div style={{ paddingTop: 4, borderTop: '1px dashed var(--color-divider)' }}>
        <div className="text-muted" style={{ fontSize: 10.5, textAlign: 'center', margin: '16px 0 8px' }}>
          Ambiente de demonstração — sem integração bancária real
        </div>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 0 }} onClick={simularPagamento}>
          Simular pagamento confirmado
        </button>
      </div>
    </div>
  );
}

function competenciaExtenso(competencia: string) {
  const map: Record<string, string> = { Jan: 'janeiro', Fev: 'fevereiro', Mar: 'março', Abr: 'abril', Mai: 'maio', Jun: 'junho', Jul: 'julho', Ago: 'agosto', Set: 'setembro', Out: 'outubro', Nov: 'novembro', Dez: 'dezembro' };
  const [mes] = competencia.split('/');
  return map[mes] ?? competencia;
}

function PixQr() {
  return (
    <svg width="146" height="146" viewBox="0 0 100 100" shapeRendering="crispEdges">
      <rect width="100" height="100" fill="#fff" />
      <g fill="#0d1b2e">
        <path fillRule="evenodd" d="M8 8h28v28H8zM14 14v16h16V14z" />
        <rect x="18" y="18" width="8" height="8" />
        <path fillRule="evenodd" d="M64 8h28v28H64zM70 14v16h16V14z" />
        <rect x="74" y="18" width="8" height="8" />
        <path fillRule="evenodd" d="M8 64h28v28H8zM14 70v16h16V70z" />
        <rect x="18" y="74" width="8" height="8" />
        <rect x="42" y="8" width="4" height="4" /><rect x="50" y="8" width="4" height="8" /><rect x="42" y="16" width="8" height="4" />
        <rect x="54" y="12" width="4" height="4" /><rect x="42" y="24" width="4" height="8" /><rect x="50" y="28" width="8" height="4" />
        <rect x="8" y="42" width="8" height="4" /><rect x="20" y="42" width="4" height="8" /><rect x="28" y="46" width="8" height="4" />
        <rect x="12" y="50" width="4" height="4" /><rect x="42" y="42" width="4" height="4" /><rect x="50" y="46" width="4" height="4" />
        <rect x="46" y="52" width="8" height="4" /><rect x="42" y="60" width="4" height="4" /><rect x="58" y="42" width="4" height="8" />
        <rect x="66" y="46" width="8" height="4" /><rect x="78" y="42" width="4" height="4" /><rect x="86" y="46" width="4" height="8" />
        <rect x="64" y="56" width="4" height="4" /><rect x="72" y="52" width="4" height="8" /><rect x="82" y="58" width="8" height="4" />
        <rect x="42" y="70" width="8" height="4" /><rect x="46" y="78" width="4" height="8" /><rect x="54" y="72" width="4" height="4" />
        <rect x="60" y="66" width="4" height="8" /><rect x="66" y="72" width="8" height="4" /><rect x="78" y="70" width="4" height="4" />
        <rect x="86" y="74" width="4" height="8" /><rect x="70" y="82" width="4" height="4" /><rect x="82" y="86" width="4" height="4" />
      </g>
    </svg>
  );
}

function Barcode() {
  const widths = [3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 2, 1, 2, 3, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 3, 2];
  let x = 0;
  return (
    <svg viewBox="0 0 260 44" preserveAspectRatio="none" style={{ width: '100%', height: 40 }}>
      <g fill="#0d1b2e">
        {widths.map((w, i) => {
          const rect = <rect key={i} x={x} width={w} height={44} />;
          x += w + (i % 3 === 0 ? 4 : 2);
          return rect;
        })}
      </g>
    </svg>
  );
}
