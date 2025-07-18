import { ITributo } from "@/types/ITributo";
import { API_CONFIG } from "@/config/api.config";

export const TributoService = {
    async getAll(): Promise<ITributo[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TRIBUTOS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar los tributos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TributoService.getAll:', error);
            throw error;
        }
    }
};