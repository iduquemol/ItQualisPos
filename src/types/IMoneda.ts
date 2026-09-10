export interface IMoneda {
  idMoneda: number;
  codigoMoneda?: string | null;
  divisa?: string | null;
  paisAdopcion?: string | null;
  monedaActiva?: boolean | null;
  fechaGrabacionMoneda?: string | null;
}