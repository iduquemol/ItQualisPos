import { API_CONFIG } from '@/config/api.config';
import { ICategorias } from '@/types/ICategorias';

export const CategoriasService = {
  async getAll(): Promise<ICategorias[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en CategoriasService.getAll:', error);
      throw error;
    }
  },

  async create(categoria: ICategorias): Promise<{ message: string; idCategoria: number }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
        {
          method: 'POST',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(categoria)
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en CategoriasService.create:', error);
      throw error;
    }
  },

  async update(categoria: ICategorias): Promise<{ message: string; idCategoria: number }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
        {
          method: 'PUT',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(categoria)
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar categoría');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en CategoriasService.update:', error);
      throw error;
    }
  },

  async delete(idCategoria: number): Promise<{ message: string }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
        {
          method: 'DELETE',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify({ idCategoria })
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en CategoriasService.delete:', error);
      throw error;
    }
  }
};

