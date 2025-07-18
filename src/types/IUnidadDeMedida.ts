export interface IUnidadDeMedida {
    idUnidadMedida: number;
    codigoUnidadMedida: string;
    nombreUnidadMedida?: string | null;
    fechaGrabacionUnidadMedida?: string | null; // ISO string format for datetime
}