import { API_CONFIG } from "@/config/api.config";
import { IPrintVenta } from "@/types/IPrintVenta";
import { IResponseVenta } from "@/types/IResponseVenta";
import { ITerceroDefault } from "@/types/ITerceroDefault";
import { IVenta } from "@/types/IVenta";

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

    async getTerceroDefault(): Promise<ITerceroDefault[]> {
            try {
                const response = await fetch(
                    API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TERCERO_DEFAULT),
                    { 
                        headers: API_CONFIG.OPTIONS.headers,
                        mode: 'cors',
                        credentials: 'same-origin'
                    }
                );
                if (!response.ok) {
                    throw new Error('Error al cargar tercero default');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error en VentaService.getTerceroDefault:', error);
                throw error;
            }
        }
};