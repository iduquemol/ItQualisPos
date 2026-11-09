export interface IFrecuenciaPagoNomina {
    idFrecuenciaPago: number;
    nombreFrecuenciaPago: string | null;
    diasFrecuenciaPago: number | null;
    diasComerciales: boolean | null;
    idFrecuenciaPagoDian: number | null;
    frecuenciaActiva: boolean | null;
    fechaGrabacionFrecuencia?: string | null;
}