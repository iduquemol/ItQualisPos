export interface IRolOpcionServicio {
  idRolOpcion: number;
  idRol: number;
  nombreRol?: string | null;
  idOpcion: number;
  nombreOpcion?: string | null;
  puedeCrear: boolean;
  puedeLeer: boolean;
  puedeActualizar: boolean;
  puedeEliminar: boolean;
  fechaGrabacionRolOpcion?: Date | string | null;
}

export interface IRolOpcionServicioResponse {
  error: boolean;
  idRolOpcion: number;
  mensaje: string;
}