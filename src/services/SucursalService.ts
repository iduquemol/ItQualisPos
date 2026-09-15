import { API_CONFIG } from '@/config/api.config';
import { ISucursales } from '@/types/ISucursales';

export const SucursalService = {
  async getAll(): Promise<ISucursales[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUCURSALES),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener sucursales');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en SucursalService.getAll:', error);
      throw error;
    }
  },

  async create(sucursal: ISucursales): Promise<{ message: string; idSucursal: number }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUCURSALES),
        {
          method: 'POST',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(sucursal)
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear sucursal');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en SucursalService.create:', error);
      throw error;
    }
  },

  async update(sucursal: ISucursales): Promise<{ message: string; idSucursal: number }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUCURSALES),
        {
          method: 'PUT',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(sucursal)
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar sucursal');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en SucursalService.update:', error);
      throw error;
    }
  },

  async delete(idSucursal: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUCURSALES)}/${idSucursal}`,
        {
          method: 'DELETE',
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar sucursal');
      }
    } catch (error) {
      console.error('Error en SucursalService.delete:', error);
      throw error;
    }
  }
};

