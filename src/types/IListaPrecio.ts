export interface IListaPrecio {
  idListaPrecio?: number;
  codigoListaPrecio: string;
  nombreListaPrecio: string;
  fechaIniciaVigencia?: string | Date | null;
  fechaFinalVigencia?: string | Date | null;
  listaPreciosActiva?: boolean;
  fechaGrabacionListaPrecio?: string | Date | null;
}