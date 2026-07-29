export interface IActividadesIca {
  idActividadIca?: number;
  codigoActividadIca: number | string;
  descripcionActividadIca: string;
  tarifaActividad: number | string;
  idExterno?: string;
  fechaGrabacionActividadIca?: string | null;
}