export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatBRLParts(value: number) {
  const [reais, centavos] = value.toFixed(2).split('.');
  const reaisFmt = Number(reais).toLocaleString('pt-BR');
  return { reais: reaisFmt, centavos };
}

export function initials(nome: string, sobrenome: string) {
  return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
}
