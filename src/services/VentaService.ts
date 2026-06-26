import { API_CONFIG } from "@/config/api.config";
import { IParametrosVentaDefault } from "@/types/IParametrosVentaDefault";
import { IPrintVenta } from "@/types/IPrintVenta";
import { IResponseVenta } from "@/types/IResponseVenta";
import { ITerceroDefault } from "@/types/ITerceroDefault";
import { ITipoDocumentoDefault } from "@/types/ITipoDocumentoDefault";
import { IVenta } from "@/types/IVenta";
import { blob } from "stream/consumers";

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
            //console.log(response.url);
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
            //console.log(response.url);
            if (!response.ok) {
                throw new Error('Error al imprimir venta por ID');
            }
            const data = await response.json();
            return data;
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
            //console.log(response.url);
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
                    body: JSON.stringify(factura)
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