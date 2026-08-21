export interface IConsecutivos {
  idConsecutivo: number;
  nombreConsecutivo: string;
  prefijoConsecutivo?: string | null;
  numeroInicial: number;
  numeroFinal?: number | null;
  numeroActual?: number | null;
  fechaVencimiento?: string | null;
  idResolucion?: number | null;
  idTipoDocumento: number;
  consecutivoActivo?: boolean | null;
  fechaGrabacionConsecutivo?: string | null;
}