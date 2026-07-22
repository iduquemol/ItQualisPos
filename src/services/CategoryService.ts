import { API_CONFIG } from '@/config/api.config';
import { ICategorias } from '@/types/ICategorias';

const categoryServiceBase = {
  getAll: async (): Promise<ICategorias[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return await response.json();
  },

  create: async (categoria: ICategorias) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });
    if (!response.ok) throw new Error('Error al crear categoría');
    return await response.json();
  },

  update: async (categoria: ICategorias) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });
    if (!response.ok) throw new Error('Error al actualizar categoría');
    return await response.json();
  },

  delete: async (idCategoria: number) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idCategoria }),
    });
    if (!response.ok) throw new Error('Error al eliminar categoría');
    return await response.json();
  },
};

export const CategoriasService = categoryServiceBase;
export const CategoryService = categoryServiceBase;