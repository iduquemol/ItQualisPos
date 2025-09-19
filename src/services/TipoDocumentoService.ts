import { API_CONFIG } from "@/config/api.config";
import { ITipoDocumento } from "@/types/ITipoDocumento";

export const TipoDocumentoService = {
    async getAll(): Promise<ITipoDocumento[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de documento');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoDocumentoService.getAll:', error);
            throw error;
        }
    },

    async getTiposVenta(): Promise<ITipoDocumento[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_VENTA),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de documento de venta');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoDocumentoService.getTiposVenta:', error);
            throw error;
        }
    },

    async getTiposNotasCredito(): Promise<ITipoDocumento[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_NOTAS_CREDITO),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de documento de notas crédito');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoDocumentoService.getTiposNotasCredito:', error);
            throw error;
        }
    },
};