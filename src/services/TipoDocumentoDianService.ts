import { API_CONFIG } from '@/config/api.config';
import { ITipoDocumentoDian } from '@/types/ITipoDocumentoDian';

export const TipoDocumentoDianService = {
  async getAll(): Promise<ITipoDocumentoDian[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_DIAN),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener tipos de documento DIAN');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en TipoDocumentoDianService.getAll:', error);
      throw error;
    }
  }
};

