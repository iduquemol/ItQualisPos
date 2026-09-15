import { IUnidadesMedidaDian } from "@/types/IUnidadesMedidaDian";
import { API_CONFIG } from "@/config/api.config";
import { IActividadesIca } from "@/types/IActividadesIca";

export const UnidadesMedidaDianService = {
    async getAll(): Promise<IUnidadesMedidaDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.UNIDADES_MEDIDA_DIAN),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar unidades de medida');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en UnidadDeMedidaService.getAll:', error);
            throw error;
        }
    }   
};