import { API_CONFIG } from "@/config/api.config";
import { IMediosPagoDian } from "@/types/IMediosPagoDian";

export const MediosPagoDianService = {
    async getAll(): Promise<IMediosPagoDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MEDIOS_PAGO_DIAN),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar medios de pago DIAN');
            }

            const raw = await response.json();
            const data: IMediosPagoDian[] = (raw as any[]).map((m) => ({
                idMedioPagoDian: m.idMedioPagoDian,
                codigoMedioPagoDian: m.codigoMedioPagoDian,
                nombreMedioPagoDian: m.nombreMedioPagoDian,
                alcanceMedioPagoDian: m.alcanceMedioPagoDian,
                medioPagoActivo: m.medioPagoActivo
            }));

            return data;
        } catch (error) {
            console.error('Error en MediosPagoDianService.getAll:', error);
            throw error;
        }
    }
};