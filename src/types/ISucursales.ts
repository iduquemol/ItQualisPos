export interface ISucursales {
    idSucursal: number;
    codigoSucursal?: string | null;
    nombreSucursal?: string | null;
    idDepartamentoSucursal?: number | null;
    idMunicipioSucursal?: number | null;
    direccionSucursal?: string | null;
    telefonoSucursal?: string | null;
    idTerceroResponsableSucursal?: number | null;
    notaFeSucursal?: string | null;
    fechaGrabacionSucursal?: Date | null;
}