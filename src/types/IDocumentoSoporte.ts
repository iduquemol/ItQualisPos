import { IDocumentoSoporteTercero } from "./IDocumentoSoporteTercero";
import { IDetalleDocumentoSoporte } from "./IDetalleDocumentoSoporte";

export interface IDocumentoSoporte {
    idDsa: number;
    idTipoDocumentoDsa: number;
    numeroDsa: number;
    prefijoDsa: string;
    idTerceroDsa: number;
    fechaDsa: string;
    plazoDiasDsa?: number | null;
    fechaVencimientoDsa?: string | null;
    idUsuario?: number | null;
    idFormaPagoDsa?: number | null;
    ordenReferenciaDsa?: string | null;
    fechaOrdenReferenciaDsa?: string | null;
    observacionesDsa?: string | null;
    totalRegistrosDsa?: number | null;
    cantidadProductosDsa?: number | null;
    totalPrecioDsa?: number | null;
    totalDescuentoDsa?: number | null;
    totalDsa?: number | null;
    cufe?: string | null;
    firmaDigital?: string | null;
    fechaHoraAutorizacion?: string | null;
    idResolucionDsa?: number | null;
    idResponseDianDsa?: number | null;
    totalBaseReteRentaDsa?: number | null;
    totalReteRentaDsa?: number | null;
    totalBaseReteIcaDsa?: number | null;
    totalReteIcaDsa?: number | null;
    idTipoOperacionDian?: number | null;
    idTipoDocumentoExterno?: number | null;
    codigoDocumento?: string | null;
    nombreDocumento?: string | null;
    fechaInicialServicio?: string | null;
    fechaFinalServicio?: string | null;
    idMetodoDian?: number | null;
    estadoDian?: string | null;
    
    terceroDsa?: IDocumentoSoporteTercero[] | null;
    detalleDsa?: IDetalleDocumentoSoporte[] | null;
}