import { API_CONFIG } from "@/config/api.config";
import { IDocumentoLista } from "@/types/IDocumentoLista";

export const DocumentoListaService = {
    async getAll(): Promise<IDocumentoLista[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DOCUMENTO_LISTA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar documentos lista');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DocumentoListaService.getAll:', error);
            throw error;
        }
    }
};