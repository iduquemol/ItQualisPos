import { API_CONFIG } from "@/config/api.config";
import { IParametrosVentaDefault } from "@/types/IParametrosVentaDefault";
import { IPrintVenta } from "@/types/IPrintVenta";
import { IResponseVenta } from "@/types/IResponseVenta";
import { IVenta } from "@/types/IVenta";

export const toVentaApiPayload = (factura: IVenta) => ({
    idVenta: factura.idVenta ?? 0,
    idTipoDocumento: factura.idTipoDocumento ?? 0,
    nombreDocumento: factura.nombreDocumento ?? null,
    idFormaPago: factura.idFormaPago ?? null,
    idMetodoPago: factura.idMetodoDian ?? null,
    numeroVenta: factura.numeroVenta ?? 0,
    prefijoVenta: factura.prefijoVenta ?? "",
    fechaVenta: factura.fechaVenta ?? null,
    esBorrador: !!factura.esBorrador,
    idPuntoVenta: factura.idPuntoVenta ?? 0,
    idUsuario: factura.idUsuario ?? 0,
    totalRegistros: factura.totalRegistros ?? 0,
    cantidadProductos: factura.cantidadProductos ?? 0,
    totalPrecio: factura.totalPrecio ?? 0,
    totalDescuento: factura.totalDescuento ?? 0,
    totalBaseIva: factura.totalBaseIva ?? 0,
    totalIva: factura.totalIva ?? 0,
    totalVenta: factura.totalVenta ?? 0,
    observaciones: factura.observaciones ?? null,
    ordenReferencia: factura.ordenReferencia ?? null,
    fechaOrdenReferencia: factura.fechaOrdenReferencia ?? null,
    terceroVenta: factura.terceroVenta ? {
        idTercero: factura.terceroVenta.idTercero ?? null,
        idTipoDocumentoId: factura.terceroVenta.idTipoDocumentoId ?? 0,
        numeroIdentificacion: factura.terceroVenta.numeroIdentificacion ?? null,
        primerNombre: factura.terceroVenta.primerNombre ?? null,
        primerApellido: factura.terceroVenta.primerApellido ?? null,
        razonSocial: factura.terceroVenta.razonSocial ?? null,
        telefonoTercero: factura.terceroVenta.telefonoTercero ?? null,
        idMunicipio: factura.terceroVenta.idMunicipio ?? null,
        emailTercero: factura.terceroVenta.emailTercero ?? null,
        idTipoPersona: factura.terceroVenta.idTipoPersona ?? null,
        terceroGeneral: !!factura.terceroVenta.terceroGeneral
    } : null,
    detalleVenta: (factura.detalleVenta ?? []).map(item => ({
        idDetalleVenta: item.idDetalleVenta ?? 0,
        registroVenta: item.registroVenta ?? 0,
        idProducto: item.idProducto ?? 0,
        codigoProducto: item.codigoProducto ?? "",
        nombreProducto: item.nombreProducto ?? "",
        cantidadVenta: item.cantidadVenta ?? 0,
        cantidadNotaCredito: item.cantidadNotaCredito ?? 0,
        indNotaCredito: !!item.indNotaCredito,
        precioUnitarioVenta: item.precioUnitarioVenta ?? 0,
        baseIvaVenta: item.baseIvaVenta ?? 0,
        porcentajeIvaVenta: item.porcentajeIvaVenta ?? 0,
        ivaVenta: item.ivaVenta ?? 0,
        porcentajeDescuentoVenta: item.porcentajeDescuentoVenta ?? 0,
        descuentoVenta: item.descuentoVenta ?? 0,
        porcentajeImpoConsumo: item.porcentajeImpoConsumo ?? 0,
        impoConsumoVenta: item.impoConsumoVenta ?? 0,
        porcentajeReteIva: item.porcentajeReteIva ?? 0,
        reteIvaVenta: item.reteIvaVenta ?? 0,
        porcentajeReteRenta: item.porcentajeReteRenta ?? 0,
        reteRentaVenta: item.reteRentaVenta ?? 0,
        baseReteRenta: item.baseReteRenta ?? 0,
        porcentajeReteIca: item.porcentajeReteIca ?? 0,
        reteIcaVenta: item.reteIcaVenta ?? 0,
        totalVenta: item.totalVenta ?? 0,
        costoUnitarioVenta: item.costoUnitarioVenta ?? 0,
        costoTotalVenta: item.costoTotalVenta ?? 0,
        idTipoProducto: item.idTipoProducto ?? 0,
        indMuestra: !!item.indMuestra
    })),
    mediosPagoVenta: (factura.mediosPagoVenta ?? []).map(item => ({
        idMedioPagoVenta: item.idMedioPagoVenta ?? 0,
        idMedioPago: item.idMedioPago ?? 0,
        valorMedioPago: item.valorMedioPago ?? 0
    }))
});

export const VentaService = {
    async getById(idventa: number): Promise<IVenta | null> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.OBTENER_VENTA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idventa: idventa })
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar venta por ID');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VentaService.getById:', error);
            throw error;
        }
    },

    async printById(idventa: number): Promise<IPrintVenta | null> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PRINT_VENTA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idventa: idventa })
                }
            );

            if (!response.ok) {
                throw new Error('Error al imprimir venta por ID');
            }

            // Validar que la respuesta tenga contenido antes de intentar parsear a JSON
            const text = await response.text();
            return text && text.trim().length > 0 ? JSON.parse(text) : null;
        } catch (error) {
            console.error('Error en VentaService.printById:', error);
            throw error;
        }
    },

    async previewPdf(idventa: number, idMetodoDian: number): Promise<Blob> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PREVIEW_PDF),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idventa: idventa, idMetodoDian: idMetodoDian })
                }
            );

            if (!response.ok) {
                throw new Error('Error al previsualizar PDF de venta por ID');
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error en VentaService.previewPdf:', error);
            throw error;
        }
    },

    async create(factura: IVenta): Promise<IResponseVenta> {
        try {
            const payload = toVentaApiPayload(factura);
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.VENTA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(payload)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear factura');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VentaService.create:', error);
            throw error;
        }
    },

    async resend(idventa: number, idmetododian: number): Promise<IResponseVenta> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.RESEND_VENTA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idventa: idventa, idmetododian: idmetododian })
                }
            );
            if (!response.ok) {
                throw new Error('Error al enviar la factura a la DIAN');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VentaService.resend:', error);
            throw error;
        }
    },

    async getParametrosVentaDefault(): Promise<IParametrosVentaDefault> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PARAMETROS_VENTA_DEFAULT),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar parámetros de venta por defecto');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VentaService.getParametrosVentaDefault:', error);
            throw error;
        }
    }
};