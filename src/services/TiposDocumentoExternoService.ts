import { ITipoDocumentoExterno } from "@/types/ITipoDocumentoExterno";
import { API_CONFIG } from "@/config/api.config";

export const TiposDocumentoExternoService = {
  async getAll(): Promise<ITipoDocumentoExterno[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_EXTERNO),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );
      if (!response.ok) {
        throw new Error('Error al cargar tipos de documento externo');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en TiposDocumentoExternoService.getAll:', error);
      throw error;
    }
  },

  async create(tipoDocumento: ITipoDocumentoExterno): Promise<any> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_EXTERNO),
        {
          method: "POST",
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            "Content-Type": "application/json"
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(tipoDocumento)
        }
      );
      if (!response.ok) {
        throw new Error('Error al crear tipo de documento externo');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en TiposDocumentoExternoService.create:', error);
      throw error;
    }
  },

  async update(tipoDocumento: ITipoDocumentoExterno): Promise<any> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_EXTERNO),
        {
          method: "PUT",
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            "Content-Type": "application/json"
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(tipoDocumento)
        }
      );
      if (!response.ok) {
        throw new Error('Error al actualizar tipo de documento externo');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en TiposDocumentoExternoService.update:', error);
      throw error;
    }
  },

  async delete(idTipoDocumentoExterno: number): Promise<void> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_EXTERNO),
        {
          method: "DELETE",
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            "Content-Type": "application/json"
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify({ idTipoDocumentoExterno })
        }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar tipo de documento externo');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en TiposDocumentoExternoService.delete:', error);
      throw error;
    }
  }
};