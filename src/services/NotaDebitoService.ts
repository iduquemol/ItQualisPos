import { API_CONFIG } from "@/config/api.config";
import { INotaDebito } from "@/types/INotaDebito";
import { IParametrosVentaDefault } from "@/types/IParametrosVentaDefault";
import { IPrintVenta } from "@/types/IPrintVenta";
import { IResponseVenta } from "@/types/IResponseVenta";
import { IVenta } from "@/types/IVenta";

export const NotaDebitoService = {
    async getAll(): Promise<INotaDebito[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.NOTAS_DEBITO),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar notas de débito');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en NotaDebitoService.getAll:', error);
            throw error;
        }
    },

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
            console.error('Error en NotaDebitoService.getById:', error);
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
                throw new Error('Error al imprimir nota débito por ID');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en NotaDebitoService.printById:', error);
            throw error;
        }
    },

    async create(notaDebito: INotaDebito): Promise<IResponseVenta> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.NOTA_DEBITO),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(notaDebito)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear nota de débito');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en NotaDebitoService.create:', error);
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
            console.error('Error en NotaDebitoService.getParametrosVentaDefault:', error);
            throw error;
        }
    }
};