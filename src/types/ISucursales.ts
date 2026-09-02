export interface ISucursales {
    idSucursal: number;
    codigoSucursal?: string | null;
    nombreSucursal?: string | null;
    idDepartamentoSucursal?: number | null;
    idMunicipioSucursal?: number | null;
    fechaGrabacionSucursal?: Date | null;
}