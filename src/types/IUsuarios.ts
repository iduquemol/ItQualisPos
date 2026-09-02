export interface IUsuarios {
  idUsuario: number;
  nombreUsuario: string;
  idRolUsuario: number;
  passUsuario: string;
  emailUsuario: string;
  idVendedor?: number | null;
  idSucursalUsuario?: number | null;
  fechaGrabacionUsuario?: Date | string | null;
}