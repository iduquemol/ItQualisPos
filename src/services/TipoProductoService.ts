import { API_CONFIG } from "@/config/api.config";
import { ITipoProducto } from "@/types/ITipoProducto";

export const TipoProductoService = {
    async getAll(): Promise<ITipoProducto[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_PRODUCTO),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de producto');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoProductoService.getAll:', error);
            throw error;
        }
    }
};