import { API_CONFIG } from "@/config/api.config";
import { IResponseVenta } from "@/types/IResponseVenta";
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
};