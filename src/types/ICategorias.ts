export interface ICategorias {
  idCategoria?: number | null;
  codigoCategoria: string;
  nombreCategoria: string;
  iconoCategoria?: string | null;
  idTarifaTributo?: number | null;
  nombreTarifa?: string | null;
  tarifa?: number | null;
  fechaGrabacionCategoria?: string | Date | null;
}