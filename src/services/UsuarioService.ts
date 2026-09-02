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

const usuarioServiceBase = {
  getAll: async (): Promise<IUsuarios[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USUARIOS}`);
    if (!response.ok) throw new Error('Error al obtener usuarios');

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    // Si el backend responde con un string JSON dentro de la propiedad 'usuarios'
    let rawUsuarios = data;
    if (data[0] && typeof data[0].usuarios === 'string') {
      rawUsuarios = JSON.parse(data[0].usuarios);
    }

    return rawUsuarios.map(normalizeUsuario);
  },

  create: async (usuario: IUsuarios) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USUARIOS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizeUsuario(usuario)),
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    return await response.json();
  },

  update: async (usuario: IUsuarios) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USUARIOS}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizeUsuario(usuario)),
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return await response.json();
  },

  delete: async (idUsuario: number) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USUARIOS}/${idUsuario}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return await response.json();
  },
};

export const UsuariosService = usuarioServiceBase;
export const UsuarioService = usuarioServiceBase;