import { API_CONFIG } from "@/config/api.config";
import { IMediosPago } from "@/types/IMediosPago";

export const MediosPagoService = {
    async getAll(): Promise<IMediosPago[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MEDIOS_PAGO),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar medios de pago');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en MediosPagoService.getAll:', error);
            throw error;
        }
    }
};