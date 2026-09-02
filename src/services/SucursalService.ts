import { API_CONFIG } from '@/config/api.config';
import { ISucursales} from '@/types/ISucursales';

const sucursalServiceBase = {
  getAll: async (): Promise<ISucursales[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUCURSALES}`);
    if (!response.ok) throw new Error('Error al obtener sucursales');
    return await response.json();
  },

  create: async (sucursal: ISucursales) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUCURSALES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sucursal),
    });
    if (!response.ok) throw new Error('Error al crear sucursal');
    return await response.json();
  },

  update: async (sucursal: ISucursales) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUCURSALES}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sucursal),
    });
    if (!response.ok) throw new Error('Error al actualizar sucursal');
    return await response.json();
  },

  delete: async (idSucursal: number) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUCURSALES}/${idSucursal}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar sucursal');
    return await response.json();
    },

};

export const SucursalesService = sucursalServiceBase;
export const SucursalService = sucursalServiceBase;