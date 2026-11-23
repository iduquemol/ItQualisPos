import { ReactNode } from "react"
import AppSidebar from "./AppSidebar"
import { Navigate, useLocation } from "react-router-dom"
import { OPCIONES_SERVICIO_POR_RUTA } from "@/config/opcionesServicio"
import { usePermisos } from "@/context/PermisosContext"

export default function AppLayout({
  children,
  onLogout,
}: {
  children: ReactNode
  onLogout: () => void
}) {
  const location = useLocation()
  const { cargandoPermisos, tienePermiso } = usePermisos()
  const idOpcion = OPCIONES_SERVICIO_POR_RUTA[location.pathname]

  if (cargandoPermisos) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center" role="status" aria-busy="true">
        Cargando permisos...
      </div>
    )
  }

  if (idOpcion !== undefined && !tienePermiso(idOpcion, "leer")) {
    return <Navigate to="/main-menu" replace />
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar onLogout={onLogout} />
      {/* <main className="flex-1">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-row items-center gap-6">
            <Card className="w-full rounded-[14px] shadow-sm">
              <CardContent>
                <div className="h-[984px] w-full rounded-[14px] border border-border bg-background" >
                {children}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main> */}
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
