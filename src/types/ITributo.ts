export interface ITributo {
    idTributo: number;
    codigoTributo?: string | null;
    nombreTributo?: string | null;
    descripcionTributo?: string | null;
    idCalculoTributo?: number | null;
    idTributoFe?: number | null;
    tributoProducto?: boolean | null;
    tributoActivo?: boolean | null;
    tributoRetencion?: boolean | null;
}