import { IFrecuenciaPagoNomina } from "@/types/IFrecuenciaPagoNomina";
import { API_CONFIG } from "@/config/api.config";

export const FrecuenciaPagoNominaService = {
    async getAll(): Promise<IFrecuenciaPagoNomina[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_FRECUENCIA_PAGOS_NOMINA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener la frecuencia de pagos de nómina');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en FrecuenciaPagoNominaService.getAll:', error);
            throw error;
        }
    }
};