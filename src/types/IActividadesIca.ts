export interface IActividadesIca {
  idActividadIca: number;
  codigoActividadIca: string;
  descripcionActividadIca: string;
  tarifaActividad?: number | null;
  idExterno?: string | null;
  fechaGrabacionActividadIca?: string | null;
}