import { API_CONFIG } from "@/config/api.config";
import { IConceptoNotaCredito } from "@/types/IConceptoNotaCredito";

export const ConceptoNotaCreditoService = {
    async getAll(): Promise<IConceptoNotaCredito[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONCEPTOS_NOTA_CREDITO),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar conceptos de nota de crédito');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ConceptoNotaCreditoService.getAll:', error);
            throw error;
        }
    }
};