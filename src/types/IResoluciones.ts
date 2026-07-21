export interface IResoluciones {
    idResolucion: number;
    numeroResolucion: string; // Hecho
    nombreResolucion: string; // Hecho
    claveTecnica: string; // Hecho
    fechaAutorizacion: string | Date | null; // Hecho
    vigenciaMeses: number; // 
    fechaInicial: string | Date | null; //
    fechaFinal: string | Date | null; //
    prefijoResolucion: string; //
    numeroInicialResolucion: number; //
    numeroFinalResolucion: number; //
    numeroActual: number; //
    resolucionActiva: boolean; //
    idTipoDocumentoDian: number;
}