import { API_CONFIG } from "@/config/api.config";
import { IEventosDian } from "@/types/IEventosDian";

export const EventoDianService = {
    async getAll(): Promise<IEventosDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EVENTOS_DIAN),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar eventos de la Dian');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EventoDianService.getAll:', error);
            throw error;
        }
    }
}