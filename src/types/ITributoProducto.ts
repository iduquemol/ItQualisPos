export interface ITributoProducto {
    idTributoProducto: number | null;
    idTributo: string;
    codigoTributo: string;
    nombreTributo: string;
    idTarifaProducto: number | null;
    codigoTarifa: string;
    nombreTarifa: string;
    tarifa: number;  
}