import { IResponsabilidadTercero } from "./IResponsabilidadTercero";

export interface ITercero {
    idTercero: number | null;
    idTipoDocumentoId: number;
    nombreTipoDocumentoId: string | null;
    digitoVerificacion: string | null;
    numeroIdentificacion: string | null;
    primerNombre: string | null;
    segundoNombre: string | null;
    primerApellido: string | null;
    segundoApellido: string | null;
    razonSocial: string | null;
    telefonoTercero: string | null;
    direccionTercero: string | null;
    idDepartamento: number;
    nombreDepartamento: string | null;
    idMunicipio: number;
    nombreMunicipio: string | null;
    emailTercero: string | null;   
    terceroActivo: boolean;
    terceroCliente: boolean;
    terceroProveedor: boolean;
    terceroEmpleado: boolean;
    terceroGeneral: boolean;
    idTipoRegimen: number;
    idListaPreciosTercero: number;
    retenedorIva: boolean;
    retenedorRenta: boolean;
    retenedorIca: boolean;
    declaraRenta: boolean;
    tarifaIca: number;
    responsabilidadesTerceros: IResponsabilidadTercero[];
}