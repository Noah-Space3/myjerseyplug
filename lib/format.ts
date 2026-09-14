export function formatNGN(amount: number): string {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

export function formatNGNPlain(amount: number): string {
  return Math.round(amount).toLocaleString('en-NG');
}
