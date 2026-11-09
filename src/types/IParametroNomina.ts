export interface IParametroNomina {
    idParametroNomina: number;
    salarioMinimoLegalVigente: number | null;
    auxilioTransporteMensual: number | null;
    porcentajeProvisionVacaciones: number | null;
    porcentajeProvisionesCesantias: number | null;
    porcentajeProvisionInteresesCesantias: number | null;
    porcentajeProvisionesPrimas: number | null;
    porcentajeAporteSalud: number | null;
    porcentajeAportePension: number | null;
    porcentajeFondoSolidaridad: number | null;
    porcentajeFondoSubsistencia: number | null;
    horasLaboralesMes: number | null;
    diasVacacionesAno: number | null;
    fechaInicialCesantias: string | null;
    fechaFinalCesantias: string | null;
    fechaInicialPrima: string | null;
    fechaFinalPrima: string | null;
    fechaPagoInteresesCesantias: string | null;
    fechaConsignacionCesantias: string | null;
    fechaPagoPrima: string | null;
    valorUVT: number | null;
    cantidadMinimoIntegral: number | null;
    porcentajePrestacionIntegral: number | null;
}