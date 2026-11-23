import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RolOpcionServicioService } from "@/services/RolOpcionServicioService";
import { IRolOpcionServicio } from "@/types/IRolOpcionServicio";
import { getAuthenticatedSession } from "@/features/auth/session";
import { toast } from "sonner";

export type AccionPermiso = "leer" | "crear" | "actualizar" | "eliminar";

interface PermisosContextValue {
  permisos: IRolOpcionServicio[];
  cargandoPermisos: boolean;
  cargarPermisosPorRol: (idRol: number) => Promise<void>;
  limpiarPermisos: () => void;
  tienePermiso: (idOpcion: number, accion: AccionPermiso) => boolean;
}

const PermisosContext = createContext<PermisosContextValue | undefined>(undefined);

export function PermisosProvider({ children }: { children: ReactNode }) {
  const [permisos, setPermisos] = useState<IRolOpcionServicio[]>([]);
  const [cargandoPermisos, setCargandoPermisos] = useState(
    () => getAuthenticatedSession() !== null,
  );
  const solicitudActual = useRef(0);

  const cargarPermisosPorRol = useCallback(async (idRol: number) => {
    if (!Number.isInteger(idRol) || idRol <= 0) {
      throw new Error("El idRol debe ser un entero positivo");
    }

    const solicitud = ++solicitudActual.current;
    setPermisos([]);
    setCargandoPermisos(true);
    try {
      const resultado = await RolOpcionServicioService.getAll({ idRol });
      if (solicitud === solicitudActual.current) {
        setPermisos(resultado);
      }
    } finally {
      if (solicitud === solicitudActual.current) {
        setCargandoPermisos(false);
      }
    }
  }, []);

  const limpiarPermisos = useCallback(() => {
    solicitudActual.current += 1;
    setPermisos([]);
    setCargandoPermisos(false);
  }, []);

  useEffect(() => {
    const session = getAuthenticatedSession();
    if (!session) return;

    void cargarPermisosPorRol(session.idRol).catch((error: unknown) => {
      console.error("Error al rehidratar permisos del usuario:", error);
      toast.error("No se pudieron cargar los permisos del usuario");
    });
  }, [cargarPermisosPorRol]);

  const tienePermiso = useCallback(
    (idOpcion: number, accion: AccionPermiso) => {
      const permiso = permisos.find((item) => item.idOpcion === idOpcion);
      if (!permiso) return false;

      switch (accion) {
        case "leer":
          return permiso.puedeLeer;
        case "crear":
          return permiso.puedeCrear;
        case "actualizar":
          return permiso.puedeActualizar;
        case "eliminar":
          return permiso.puedeEliminar;
      }
    },
    [permisos],
  );

  const value = useMemo(
    () => ({ permisos, cargandoPermisos, cargarPermisosPorRol, limpiarPermisos, tienePermiso }),
    [permisos, cargandoPermisos, cargarPermisosPorRol, limpiarPermisos, tienePermiso],
  );

  return <PermisosContext.Provider value={value}>{children}</PermisosContext.Provider>;
}

export function usePermisos(): PermisosContextValue {
  const context = useContext(PermisosContext);
  if (!context) {
    throw new Error("usePermisos debe usarse dentro de PermisosProvider");
  }
  return context;
}
