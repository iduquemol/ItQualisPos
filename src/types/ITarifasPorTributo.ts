export interface ITarifaTributo {
    idTarifaTributo: number;
    idTributo?: number | null;
    codigoTarifa?: string | null;
    nombreTarifa?: string | null;
    descripcionTarifa?: string | null;
    replicaDeclarante?: boolean | null;
    aplicaNoDeclarante?: boolean | null;
    baseUVT?: number | null;
    tarifaTributo?: number | null;
    tarifaActiva?: boolean | null;
    tarifaDefault?: boolean | null;
    idExterno?: string | null;
}

export interface ITarifasPorTributo {
    idTributo: number;
    codigoTributo?: string | null;
    nombreTributo?: string | null;
    tarifasTributo: ITarifaTributo[];
}