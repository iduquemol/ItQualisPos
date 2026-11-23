import {
  ChevronDown,
  Receipt,
  ScrollText,
  FileText,
  SlidersHorizontal,
  FileCog,
  Package,
  FolderTree,
  Users,
  Building2,
  Landmark,
  FileCheck2,
  GitBranch,
  BadgeDollarSign,
  UserCog,
} from "lucide-react"

import { NavLink } from "react-router-dom"
import { LogOut } from "lucide-react"
import { OPCIONES_SERVICIO_POR_RUTA } from "@/config/opcionesServicio"
import { usePermisos } from "@/context/PermisosContext"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Mismas rutas que ya existían en MainMenu.tsx (menuItems), agrupadas visualmente
// al estilo del sidebar de referencia.
const menuGroups = [
  {
    label: "Ventas",
    icon: Receipt,
    children: [
      { label: "Ventas", icon: Receipt, path: "/pos" },
      { label: "Cotizaciones", icon: ScrollText, path: "/estimates" },
      { label: "Notas Crédito", icon: FileText, path: "/credit-notes" },
      { label: "Notas Débito", icon: FileText, path: "/debit-notes" },
      { label: "Documentos Soporte", icon: FileCog, path: "/documento-soporte" },
      { label: "Tipos de Documentos", icon: FileText, path: "/documentos-externos" },
      { label: "Parámetros del Sistema", icon: SlidersHorizontal, path: "/parametros-venta" },
    ],
  },
  {
    label: "Productos",
    icon: Package,
    children: [
      { label: "Items", icon: Package, path: "/items" },
      { label: "Categorías", icon: FolderTree, path: "/categories" },
      { label: "Unidades de Medida", icon: FolderTree, path: "/unidades-medida" },
      { label: "Listas de Precios", icon: FolderTree, path: "/listas-precios" },
    ],
  },
  {
    label: "Directorio",
    icon: Users,
    children: [
      { label: "Terceros", icon: Users, path: "/terceros" },
    ],
  },
  {
    label: "Empresa",
    icon: Building2,
    children: [
      { label: "Empresas", icon: Building2, path: "/empresas" },
      { label: "Almacenes", icon: Building2, path: "/almacenes" },
      { label: "Resoluciones", icon: FileCheck2, path: "/resoluciones" },
      { label: "Actividades ICA", icon: Landmark, path: "/actividades-ica" },
      { label: "Sucursales", icon: GitBranch, path: "/sucursales" },
      { label: "Vendedores", icon: BadgeDollarSign, path: "/vendedores" },
      { label: "Usuarios", icon: UserCog, path: "/usuarios" },
    ],
  },
]

export default function AppSidebar({ onLogout }: { onLogout: () => void }) {
  const { cargandoPermisos, tienePermiso } = usePermisos()

  return (
    <aside className="flex min-h-screen w-[280px] shrink-0 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center px-4">
        <div className="flex w-full items-center gap-2 rounded-md p-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">A</span>
          </div>
          <h2 className="text-[18px] font-semibold leading-7">Astil</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {menuGroups.map((group) => {
          const visibleChildren = group.children.filter((child) => {
            const idOpcion = OPCIONES_SERVICIO_POR_RUTA[child.path]
            return idOpcion !== undefined && tienePermiso(idOpcion, "leer")
          })
          if (cargandoPermisos || visibleChildren.length === 0) return null

          const GroupIcon = group.icon

          return (
            <Collapsible key={group.label} defaultOpen>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="group flex h-9 w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-medium hover:bg-muted"
                >
                  <GroupIcon className="size-4 shrink-0" />
                  <span className="flex-1">{group.label}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-4 border-l border-border py-1 pl-2">
                  {visibleChildren.map((child) => {
                    const Icon = child.icon

                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          [
                            "flex min-h-9 w-full items-center gap-2 rounded-md px-2 py-2",
                            "text-sm transition-colors",
                            isActive
                              ? "bg-muted font-medium text-foreground"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground",
                          ].join(" ")
                        }
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1">{child.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </nav>
      <div className="mt-auto p-2">
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-9 w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
