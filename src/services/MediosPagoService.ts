import { API_CONFIG } from "@/config/api.config";
import { IMediosPago } from "@/types/IMediosPago";

export const MediosPagoService = {
    async getAll(): Promise<IMediosPago[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MEDIOS_PAGO),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar medios de pago');
            }
            // El backend devuelve objetos con propiedades en singular (idMedioPago, nombreMedioPago, etc.).
            // Aseguramos el tipo correcto mapeando explícitamente, así el frontend no depende de la forma
            // exacta que regrese el servidor y evitamos errores si el DTO cambia.
            const raw = await response.json();
            const data: IMediosPago[] = (raw as any[]).map((m) => ({
                idMedioPago: m.idMedioPago,
                codigoMedioPago: m.codigoMedioPago,
                nombreMedioPago: m.nombreMedioPago,
                codigoDianMedioPago: m.codigoDianMedioPago,
            }));
            return data;
        } catch (error) {
            console.error('Error en MediosPagoService.getAll:', error);
            throw error;
        }
    }
};