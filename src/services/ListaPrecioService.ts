import { API_CONFIG } from "@/config/api.config";
import { IListaPrecio } from "@/types/IListaPrecio";

export const ListaPrecioService = {
    async getAll(): Promise<IListaPrecio[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LISTAS_PRECIOS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar la lista de precios');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ListaPrecioService.getAll:', error);
            throw error;
        }
    }
};