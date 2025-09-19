import { API_CONFIG } from "@/config/api.config";
import { INotaCredito } from "@/types/INotaCredito";
import { IParametrosVentaDefault } from "@/types/IParametrosVentaDefault";
import { IPrintVenta } from "@/types/IPrintVenta";
import { IResponseVenta } from "@/types/IResponseVenta";
import { ITerceroDefault } from "@/types/ITerceroDefault";
import { ITipoDocumentoDefault } from "@/types/ITipoDocumentoDefault";
import { IVenta } from "@/types/IVenta";

export const NotaCreditoService = {
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

    async create(notaCredito: INotaCredito): Promise<IResponseVenta> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.NOTA_CREDITO),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(notaCredito)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear nota de crédito');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en NotaCreditoService.create:', error);
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