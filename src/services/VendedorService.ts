import { API_CONFIG } from '@/config/api.config';
import { IVendedores} from '@/types/IVendedores';

const vendedorServiceBase = {
  getAll: async (): Promise<IVendedores[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VENDEDORES}`);
    if (!response.ok) throw new Error('Error al obtener vendedores');
    return await response.json();
  },

  create: async (vendedor: IVendedores) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VENDEDORES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendedor),
    });
    if (!response.ok) throw new Error('Error al crear vendedor');
    return await response.json();
  },

  update: async (vendedor: IVendedores) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VENDEDORES}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendedor),
    });
    if (!response.ok) throw new Error('Error al actualizar vendedor');
    return await response.json();
  },

  delete: async (idVendedor: number) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VENDEDORES}/${idVendedor}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar vendedor');
    return await response.json();
    },

};

export const VendedoresService = vendedorServiceBase;
export const VendedorService = vendedorServiceBase;