import { API_CONFIG } from "@/config/api.config";
import { IDocumentoSoporte } from "@/types/IDocumentoSoporte";

export const DocumentoSoporteService = {
    async getById(idDsa: number): Promise<IDocumentoSoporte | null> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.OBTENER_DOCUMENTO_SOPORTE),
                {
                    method: "post",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idDsa: idDsa })
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar documento de soporte por ID');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DocumentoSoporteService.getById:', error);
            throw error;
        }
    },      
};