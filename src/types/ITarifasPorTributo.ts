export interface ITarifasPorTributo {
    idTributo: number;
    codigoTributo: string;
    nombreTributo: string;
    tarifasTributo: {
        idTarifaTributo: number;
        codigoTarifa: string;
        nombreTarifa: string;
        tarifaTributo: number;
    }[];
}