import { API_CONFIG } from '@/config/api.config';
import { IUsuarios } from '@/types/IUsuarios';

const normalizeUsuario = (usuario: Partial<IUsuarios> & Record<string, any>): IUsuarios => ({
  idUsuario: usuario.idUsuario ?? 0,
  nombreUsuario: usuario.nombreUsuario ?? '',
  idRolUsuario: usuario.idRolUsuario ?? 1,
  passUsuario: usuario.passUsuario ?? '',
  emailUsuario: usuario.emailUsuario ?? usuario.correoElectronico ?? usuario.email ?? '',
  idVendedor: usuario.idVendedor ?? null,
  idSucursalUsuario: usuario.idSucursalUsuario ?? null,
  fechaGrabacionUsuario: usuario.fechaGrabacionUsuario ?? null,
});

export const UsuarioService = {
  async getAll(): Promise<IUsuarios[]> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.USUARIOS),
        {
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return [];

      let rawUsuarios = data;
      if (data[0] && typeof data[0].usuarios === 'string') {
        rawUsuarios = JSON.parse(data[0].usuarios);
      }

      return rawUsuarios.map(normalizeUsuario);
    } catch (error) {
      console.error('Error en UsuarioService.getAll:', error);
      throw error;
    }
  },

  async create(usuario: IUsuarios): Promise<{ message: string; idUsuario: number }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.USUARIOS),
        {
          method: 'POST',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(normalizeUsuario(usuario))
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear usuario');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en UsuarioService.create:', error);
      throw error;
    }
  },

  async update(usuario: IUsuarios): Promise<{ message: string; idUsuario: number }> {
    try {
      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.USUARIOS),
        {
          method: 'PUT',
          headers: {
            ...API_CONFIG.OPTIONS.headers,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(normalizeUsuario(usuario))
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en UsuarioService.update:', error);
      throw error;
    }
  },

  async delete(idUsuario: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.USUARIOS)}/${idUsuario}`,
        {
          method: 'DELETE',
          headers: API_CONFIG.OPTIONS.headers,
          mode: 'cors',
          credentials: 'same-origin'
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error en UsuarioService.delete:', error);
      throw error;
    }
  }
};

