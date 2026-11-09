import { API_CONFIG } from "@/config/api.config";
import { IConceptoNotaDebito } from "@/types/IConceptoNotaDebito";

export const ConceptoNotaDebitoService = {
    async getAll(): Promise<IConceptoNotaDebito[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONCEPTOS_NOTA_DEBITO),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar conceptos de nota de débito');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ConceptoNotaDebitoService.getAll:', error);
            throw error;
        }
    }
};