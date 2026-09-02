import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, X, Save, Trash, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IUsuarios } from "@/types/IUsuarios";
import { UsuarioService } from "@/services/UsuarioService";
import { RolService } from "@/services/RolService";
import { VendedorService } from "@/services/VendedorService";
import { SucursalService } from "@/services/SucursalService";
import { IRoles } from "@/types/IRoles";
import { IVendedores } from "@/types/IVendedores";
import { ISucursales } from "@/types/ISucursales";

export default function UsersMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [usuario, setUsuario] = useState<IUsuarios>({
    idUsuario: 0,
    nombreUsuario: "",
    idRolUsuario: 1,
    passUsuario: "",
    emailUsuario: "",
    idVendedor: null,
    idSucursalUsuario: null,
    fechaGrabacionUsuario: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuariosList, setUsuariosList] = useState<IUsuarios[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listas para los combos (selects)
  const [rolesList, setRolesList] = useState<IRoles[]>([]);
  const [vendedoresList, setVendedoresList] = useState<IVendedores[]>([]);
  const [sucursalesList, setSucursalesList] = useState<ISucursales[]>([]);

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await UsuarioService.getAll();
      setUsuariosList(data);
      if (data.length > 0) {
        setUsuario(data[0]); // Carga el primer usuario en los campos del formulario
      }
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCombosData = async () => {
    try {
      const [rolesData, vendedoresData, sucursalesData] = await Promise.all([
        RolService.getAll(),
        VendedorService.getAll(),
        SucursalService.getAll(),
      ]);
      setRolesList(rolesData || []);
      setVendedoresList(vendedoresData || []);
      setSucursalesList(sucursalesData || []);
    } catch (error) {
      toast.error("Error al cargar los datos de los selectores (Roles/Vendedores/Sucursales)");
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchCombosData();
  }, []);

  const handleSelectUsuario = (item: IUsuarios) => {
    setUsuario(item);
    setOpenDialog(false);
  };

  const handleNew = () => {
    setUsuario({
      idUsuario: 0,
      nombreUsuario: "",
      idRolUsuario: rolesList.length > 0 ? rolesList[0].idRol : 1,
      passUsuario: "",
      emailUsuario: "",
      idVendedor: null,
      idSucursalUsuario: null,
      fechaGrabacionUsuario: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    if (!usuario.nombreUsuario?.trim()) {
      setFormError("El nombre de usuario es obligatorio.");
      return;
    }
    if (!usuario.emailUsuario?.trim()) {
      setFormError("El email del usuario es obligatorio.");
      return;
    }
    if (!usuario.idRolUsuario) {
      setFormError("Debe seleccionar un rol para el usuario.");
      return;
    }
    if (!usuario.idUsuario && !usuario.passUsuario?.trim()) {
      setFormError("La contraseña es obligatoria.");
      return;
    }

    setFormError(null);

    const payload: IUsuarios = {
      ...usuario,
      idVendedor: usuario.idVendedor ? Number(usuario.idVendedor) : null,
      idSucursalUsuario: usuario.idSucursalUsuario ? Number(usuario.idSucursalUsuario) : null,
      idRolUsuario: Number(usuario.idRolUsuario),
    };

    try {
      if (usuario.idUsuario) {
        await UsuarioService.update(payload);
        setSuccessMessage("Usuario actualizado correctamente.");
      } else {
        await UsuarioService.create(payload);
        setSuccessMessage("Usuario guardado correctamente.");
      }
      setShowSuccessDialog(true);
      fetchUsuarios();
    } catch (error) {
      toast.error("Error al guardar el usuario");
    }
  };

  const handleDelete = () => {
    if (!usuario.idUsuario) {
      toast.error("No hay un usuario seleccionado para eliminar");
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (usuario.idUsuario) {
        await UsuarioService.delete(usuario.idUsuario);
        toast.success("Usuario eliminado correctamente");
        handleNew();
        fetchUsuarios();
      }
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="p-6 bg-muted min-h-screen">
      {/* Header Marca */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-primary p-3 rounded-lg">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Astil</h1>
          <p className="text-sm text-muted-foreground">Sistema de Punto de Venta</p>
        </div>
      </div>

      {/* Título y Acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Maestro de Usuarios</h2>
          <p className="text-muted-foreground text-sm">
            Gestión de usuarios del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="icon" title="Nuevo usuario" onClick={handleNew}>
            <Plus className="w-5 h-5" />
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar usuario">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Usuario</DialogTitle>
              </DialogHeader>
              <Input
                className="mb-4"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosList
                      .filter(
                        (u) =>
                          u.nombreUsuario?.toLowerCase().includes(search.toLowerCase()) ||
                          u.emailUsuario?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((u) => (
                        <TableRow
                          key={u.idUsuario}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectUsuario(u)}
                        >
                          <TableCell>{u.nombreUsuario}</TableCell>
                          <TableCell>{u.emailUsuario}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {isLoading && <div className="text-center py-4">Cargando...</div>}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="default" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          <Button variant="default" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={() => navigate("/main-menu")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Formulario principal */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Nombre de Usuario (*)
            </label>
            <Input
              value={usuario.nombreUsuario ?? ""}
              onChange={(e) => {
                setUsuario({ ...usuario, nombreUsuario: e.target.value });
                setFormError(null);
              }}
              placeholder="Ej. jperez"
              className={formError && !usuario.nombreUsuario?.trim() ? "border-red-500" : ""}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Correo Electrónico (*)
            </label>
            <Input
              type="email"
              value={usuario.emailUsuario ?? ""}
              onChange={(e) => {
                setUsuario({ ...usuario, emailUsuario: e.target.value });
                setFormError(null);
              }}
              placeholder="correo@ejemplo.com"
              className={formError && !usuario.emailUsuario?.trim() ? "border-red-500" : ""}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Contraseña {usuario.idUsuario ? "(*)" : "(*)"}
            </label>
            <Input
              type="password"
              value={usuario.passUsuario ?? ""}
              onChange={(e) => {
                setUsuario({ ...usuario, passUsuario: e.target.value });
                setFormError(null);
              }}
              placeholder="******"
              className={formError && !usuario.idUsuario && !usuario.passUsuario?.trim() ? "border-red-500" : ""}
              required={!usuario.idUsuario} // Requerido solo si es un nuevo usuario
            />
          </div>

          {/* Select de Rol */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Rol (*)
            </label>
            <select
              value={usuario.idRolUsuario ?? ""}
              onChange={(e) => {
                setUsuario({ ...usuario, idRolUsuario: Number(e.target.value) });
                setFormError(null);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="" disabled>
                Seleccione un rol...
              </option>
              {rolesList.map((r) => (
                <option key={r.idRol} value={r.idRol}>
                  {r.nombreRol}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Vendedor */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Vendedor
            </label>
            <select
              value={usuario.idVendedor ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setUsuario({
                  ...usuario,
                  idVendedor: val ? Number(val) : null,
                });
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Sin Vendedor Asignado --</option>
              {vendedoresList.map((v) => (
                <option key={v.idVendedor} value={v.idVendedor}>
                  {v.nombreVendedor}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Sucursal */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Sucursal
            </label>
            <select
              value={usuario.idSucursalUsuario ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setUsuario({
                  ...usuario,
                  idSucursalUsuario: val ? Number(val) : null,
                });
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Sin Sucursal Asignada --</option>
              {sucursalesList.map((s) => (
                <option key={s.idSucursal} value={s.idSucursal}>
                  {s.nombreSucursal}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formError && (
          <div className="mt-4 text-xs text-red-500">{formError}</div>
        )}
      </Card>

      {/* AlertDialog Éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Operación exitosa!</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar al usuario "{usuario.nombreUsuario || "seleccionado"}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}