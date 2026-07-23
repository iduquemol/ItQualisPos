import { API_CONFIG } from "@/config/api.config";
import { IParametrosVentaDefault } from "@/types/IParametrosVentaDefault";

export const ParametrosVentasService = {
  async getDefault(): Promise<IParametrosVentaDefault> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PARAMETROS_VENTA_DEFAULT),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al cargar parámetros de venta por defecto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en ParametrosVentasService.getDefault:', error);
      throw error;
    }
  },

  async create(parametros: any): Promise<any> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PARAMETROS_VENTA),
        {
          method: "POST",
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            "Content-Type": "application/json"
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(parametros)
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear parámetros de venta');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en ParametrosVentasService.create:', error);
      throw error;
    }
  },

  async update(parametros: any): Promise<any> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PARAMETROS_VENTA),
        {
          method: "PUT",
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            "Content-Type": "application/json"
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(parametros)
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar parámetros de venta');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en ParametrosVentasService.update:', error);
      throw error;
    }
  }
};