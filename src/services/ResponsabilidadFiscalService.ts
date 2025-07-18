import { API_CONFIG } from "@/config/api.config";
import { IResponsabilidadFiscal } from "@/types/IResponsabilidadFiscal";

export const ResponsabilidadFiscalService = {
    async getAll(): Promise<IResponsabilidadFiscal[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.RESPONSABILIDADES_F),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar responsabilidades fiscales');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ResponsabilidadFiscalService.getAll:', error);
            throw error;
        }
    }
};