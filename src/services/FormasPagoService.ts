import { IFormasPago } from "@/types/IFormasPago";
import { API_CONFIG } from "@/config/api.config";

export const FormasPagoService = {
  async getAll(): Promise<IFormasPago[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.FORMAS_PAGO),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );
      if (!response.ok) {
        throw new Error('Error al cargar las formas de pago');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en FormasPagoService.getAll:', error);
      throw error;
    }
  }
};