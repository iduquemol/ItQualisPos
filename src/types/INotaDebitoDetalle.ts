export interface INotaDebitoDetalle {
  idDetalleNotaDebito: number | null;
  idNotaDebito: number;
  registroNotaDebito: number;
  idDetalleVenta?: number | null;
  idProducto?: number | null;
  nombreProducto?: string | null;
  cantidadNotaDebito?: number | null;
  precioUnitarioNotaDebito?: number | null;
  precioTotalNotaDebito?: number | null;
  porcentajeDescuentoNotaDebito?: number | null;
  descuentoNotaDebito?: number | null;
  baseIvaNotaDebito?: number | null;
  porcentajeIvaNotaDebito?: number | null;
  ivaNotaDebito?: number | null;
  totalNotaDebito?: number | null;
  costoUnitarioNotaDebito?: number | null;
  costoTotalNotaDebito?: number | null;
  fechaGrabacionDetalleNotaDebito?: string | null;
  porcentajeRetelva?: number | null;
  baseRetelvaNotaDebito?: number | null;
  retelvaNotaDebito?: number | null;
  porcentajeReteRenta?: number | null;
  baseReteRenta?: number | null;
  reteRentaNotaDebito?: number | null;
  porcentajeRetelca?: number | null;
  baseRetelca?: number | null;
  retelcaNotaDebito?: number | null;
  idTerceroMandato?: number | null;
  idItemSector?: number | null;
  indicadorMuestra?: boolean | null;
  valorReferenciaUnidad?: number | null;
  valorReferenciaTotal?: number | null;

  codigoProducto?: string | null;
}