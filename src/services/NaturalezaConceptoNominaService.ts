import { INaturalezaConceptoNomina } from "@/types/INaturalezaConceptoNomina";
import { API_CONFIG } from "@/config/api.config";

export const NaturalezaConceptoNominaService = {
    async getAll(): Promise<INaturalezaConceptoNomina[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_NATURALEZA_CONCEPTOS_NOMINA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener la naturaleza de conceptos de nómina');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en NaturalezaConceptoNominaService.getAll:', error);
            throw error;
        }
    }
};