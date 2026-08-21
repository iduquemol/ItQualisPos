import { IConsecutivos } from "@/types/IConsecutivos";
import { API_CONFIG } from "@/config/api.config";

export const ConsecutivosService = {
  async getAll(): Promise<IConsecutivos[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSECUTIVOS),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );
      if (!response.ok) {
        throw new Error('Error al cargar los consecutivos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en ConsecutivosService.getAll:', error);
      throw error;
    }
  }
};