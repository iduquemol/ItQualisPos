import { API_CONFIG } from "@/config/api.config";
import { ITipoDocumentoIdentidad } from "@/types/ITipoDocumentoIdentidad";

export const TipoDocumentoIdentidadService = {
    async getAll(): Promise<ITipoDocumentoIdentidad[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPO_DOCUMENTO_IDENTIDAD),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de documento de identidad');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoDocumentoIdentidadService.getAll:', error);
            throw error;
        }
    }
};