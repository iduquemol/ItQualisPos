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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Pencil,
  Search,
  X,
  CircleX,
  Save,
  Trash,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { IResoluciones } from "@/types/IResoluciones";
import { ResolucionesService } from "@/services/ResolucionesService";

export default function ResolutionsMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // helper para normalizar fechas a YYYY-MM-DD (valor que acepta el <input type="date"/>)
  const formatDateInput = (date: string | Date | null | undefined): string =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  // Estado para los campos iniciales del Tipo de Documento Externo
  const [resoluciones, setResoluciones] = useState<IResoluciones>({
    idResolucion: 0,
    numeroResolucion: "",
    nombreResolucion: "",
    claveTecnica: "",
    fechaAutorizacion: null,
    vigenciaMeses: 0,
    fechaInicial: null,
    fechaFinal: null,
    prefijoResolucion: "",
    numeroInicialResolucion: 0,
    numeroFinalResolucion: 0,
    numeroActual: 0,
    resolucionActiva: false,
    idTipoDocumentoDian: 0,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResoluciones, setSelectedResoluciones] =
    useState<IResoluciones | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [resolutions, setResolutions] = useState<IResoluciones[]>([]);
  const [isLoadingResolutions, setIsLoadingResolutions] = useState(true);
  const [resolutionsError, setResolutionsError] = useState<string | null>(null);

  const handleSelectResoluciones = (resolucion: IResoluciones) => {
    setSelectedResoluciones(resolucion);
    setResoluciones({
      ...resolucion,
      idResolucion: resolucion.idResolucion,
      numeroResolucion: resolucion.numeroResolucion,
      nombreResolucion: resolucion.nombreResolucion,
      claveTecnica: resolucion.claveTecnica,
      fechaAutorizacion: resolucion.fechaAutorizacion,
      vigenciaMeses: resolucion.vigenciaMeses,
      fechaInicial: resolucion.fechaInicial,
      fechaFinal: resolucion.fechaFinal,
      prefijoResolucion: resolucion.prefijoResolucion,
      numeroInicialResolucion: resolucion.numeroInicialResolucion,
      numeroFinalResolucion: resolucion.numeroFinalResolucion,
      numeroActual: resolucion.numeroActual,
      resolucionActiva: resolucion.resolucionActiva,
      idTipoDocumentoDian: resolucion.idTipoDocumentoDian,
    });
    setOpenDialog(false);
  };

  const handleSaveResoluciones = async () => {
    // Validación de campos obligatorios
    if (!resoluciones.numeroResolucion?.trim()) {
      setFormError("El número de resolución es obligatorio.");
      return;
    }
    setFormError(null);
    try {
      if (resoluciones.idResolucion) {
        // Actualizar resolución existente
        await ResolucionesService.update(resoluciones);
        console.log("Resolución actualizada:", resoluciones);
        setSuccessMessage("Resolución actualizada correctamente");
        setShowSuccessDialog(true);
      } else {
        const result = await ResolucionesService.create(resoluciones);
        console.log("Resolución guardada:", result);
        setSuccessMessage("Resolución guardada correctamente");
        setShowSuccessDialog(true);
      }
      fetchResolutions();
    } catch (error) {
      console.error("Error al guardar la resolución:", error);
    }
  };

  const handleNew = async () => {
    setResoluciones({
      idResolucion: 0,
      numeroResolucion: "",
      nombreResolucion: "",
      claveTecnica: "",
      fechaAutorizacion: null,
      vigenciaMeses: 0,
      fechaInicial: null,
      fechaFinal: null,
      prefijoResolucion: "",
      numeroInicialResolucion: 0,
      numeroFinalResolucion: 0,
      numeroActual: 0,
      resolucionActiva: false,
      idTipoDocumentoDian: 0,
    });
  };

  const handleDeleteResoluciones = async () => {
    // Verificar que hay un tipo de documento externo seleccionado para eliminar
    if (!resoluciones.idResolucion) {
      toast.error("No hay una resolución seleccionada para eliminar", {
        position: "top-center",
      });
      return;
    }

    setShowDeleteDialog(true);
  };

  // Agregar esta nueva función para confirmar la eliminación
  const confirmDeleteResoluciones = async () => {
    try {
      if (resoluciones.idResolucion === null) {
        toast.error("No se puede eliminar: ID de resolución no válido", {
          position: "top-center",
        });
        setShowDeleteDialog(false);
        return;
      }
      await ResolucionesService.delete(resoluciones.idResolucion);
      console.log("Resolución eliminada:", resoluciones.idResolucion);
      toast.success("Resolución eliminada correctamente", {
        position: "top-center",
      });

      // Limpiar el formulario después de eliminar
      setResoluciones({
        idResolucion: 0,
        numeroResolucion: "",
        nombreResolucion: "",
        claveTecnica: "",
        fechaAutorizacion: null,
        vigenciaMeses: 0,
        fechaInicial: null,
        fechaFinal: null,
        prefijoResolucion: "",
        numeroInicialResolucion: 0,
        numeroFinalResolucion: 0,
        numeroActual: 0,
        resolucionActiva: false,
        idTipoDocumentoDian: 0,
      });
      setSelectedResoluciones(null);

      // Recargar la lista de tipos de documentos externos
      fetchResolutions();

      // Cerrar el diálogo
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar la resolución:", error);
      toast.error("Error al eliminar la resolución", {
        position: "top-center",
      });
      setShowDeleteDialog(false);
    }
  };

  const fetchResolutions = async () => {
    try {
      setResolutionsError(null);
      setIsLoadingResolutions(true);
      const data = await ResolucionesService.getAll();
      setResolutions(data);
    } catch (error) {
      console.error("Error:", error);
      setResolutionsError("Error al cargar los tipos de documentos externos");
    } finally {
      setIsLoadingResolutions(false);
    }
  };

  // Cargar data al iniciar el componente
  useEffect(() => {
    fetchResolutions();
  }, []);

  return (
    <div className="p-6 bg-muted min-h-screen">
      {/* Logo y título principal */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-primary p-3 rounded-lg">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Astil</h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Punto de Venta
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Maestro de Resoluciones</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de resoluciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="Nueva resolución"
            onClick={() => handleNew()}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Dialog de búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar resolución">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Resolución</DialogTitle>
              </DialogHeader>
              {/* Input de búsqueda */}
              <Input
                className="mb-4"
                placeholder="Buscar por código o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Prefijo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolutions
                      .filter(
                        (resolution) =>
                          resolution.numeroResolucion
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          resolution.nombreResolucion
                            ?.toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((resolution) => (
                        <TableRow
                          key={resolution.idResolucion}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectResoluciones(resolution)}
                        >
                          <TableCell>{resolution.numeroResolucion}</TableCell>
                          <TableCell>{resolution.nombreResolucion}</TableCell>
                          <TableCell>{resolution.prefijoResolucion}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {isLoadingResolutions && (
                  <div className="text-center text-muted-foreground py-4">
                    Cargando...
                  </div>
                )}
                {resolutionsError && (
                  <div className="text-center text-red-500 py-4">
                    {resolutionsError}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="default"
            title="Guardar tipo de documento externo"
            onClick={handleSaveResoluciones}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button
            variant="default"
            title="Eliminar tipo de documento externo"
            onClick={handleDeleteResoluciones}
          >
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
          <Button
            variant="default"
            size="icon"
            title="Salir"
            onClick={() => {
              navigate("/main-menu");
            }}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Formulario simplificado */}
      <Tabs defaultValue="general" className="w-full">
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número de Resolución
                </label>
                <Input
                  value={resoluciones.numeroResolucion ?? ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      numeroResolucion: e.target.value,
                    })
                  }
                  placeholder="Número de Resolución"
                  required
                  className={
                    !resoluciones.numeroResolucion?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !resoluciones.numeroResolucion?.trim() && (
                  <span className="text-xs text-red-500">
                    El número de resolución es obligatorio.
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre de la Resolución
                </label>
                <Input
                  value={resoluciones.nombreResolucion ?? ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      nombreResolucion: e.target.value,
                    })
                  }
                  placeholder="Nombre"
                  required
                  className={
                    !resoluciones.nombreResolucion?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !resoluciones.nombreResolucion?.trim() && (
                  <span className="text-xs text-red-500">
                    El nombre es obligatorio.
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Clave Técnica
                </label>
                <Input
                  value={resoluciones.claveTecnica ?? ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      claveTecnica: e.target.value,
                    })
                  }
                  placeholder="Clave Técnica"
                  required
                  className={
                    !resoluciones.claveTecnica?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !resoluciones.claveTecnica?.trim() && (
                  <span className="text-xs text-red-500">
                    La clave técnica es obligatoria.
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Vigencia
                </label>
                <Input
                  type="number"
                  value={resoluciones.vigenciaMeses || ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      vigenciaMeses: Number(e.target.value),
                    })
                  }
                  placeholder="Vigencia en meses"
                  className={
                    !resoluciones.vigenciaMeses && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Prefijo Resolución
                </label>
                <Input
                  value={resoluciones.prefijoResolucion ?? ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      prefijoResolucion: e.target.value,
                    })
                  }
                  placeholder="Prefijo"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número Inicial
                </label>
                <Input
                  type="number"
                  value={resoluciones.numeroInicialResolucion || ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      numeroInicialResolucion: Number(e.target.value),
                    })
                  }
                  placeholder="Número Inicial"
                  className={
                    !resoluciones.numeroInicialResolucion && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número Final
                </label>
                <Input
                  type="number"
                  value={resoluciones.numeroFinalResolucion || ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      numeroFinalResolucion: Number(e.target.value),
                    })
                  }
                  placeholder="Número Final"
                  className={
                    !resoluciones.numeroFinalResolucion && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número Actual
                </label>
                <Input
                  type="number"
                  value={resoluciones.numeroActual || ""}
                  onChange={(e) =>
                    setResoluciones({
                      ...resoluciones,
                      numeroActual: Number(e.target.value),
                    })
                  }
                  placeholder="Número Actual"
                  className={
                    !resoluciones.numeroActual && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-xs text-muted-foreground min-w-32">
                  Resolución Activa
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={resoluciones.resolucionActiva || false}
                    onChange={(e) =>
                      setResoluciones({
                        ...resoluciones,
                        resolucionActiva: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    {resoluciones.resolucionActiva ? "Si" : "No"}
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Fecha de Autorización
                  </label>
                  <Input
                    type="date"
                    value={formatDateInput(resoluciones.fechaAutorizacion)}
                    onChange={(e) =>
                      setResoluciones({
                        ...resoluciones,
                        fechaAutorizacion: e.target.value,
                      })
                    }
                    placeholder="Fecha de autorización"
                    required
                    className={
                      !formatDateInput(resoluciones.fechaAutorizacion) &&
                      formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                  {formError &&
                    !formatDateInput(resoluciones.fechaAutorizacion) && (
                      <span className="text-xs text-red-500">
                        La fecha de autorización es obligatoria.
                      </span>
                    )}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Fecha Inicial
                  </label>
                  <Input
                    type="date"
                    value={formatDateInput(resoluciones.fechaInicial)}
                    onChange={(e) =>
                      setResoluciones({
                        ...resoluciones,
                        fechaInicial: e.target.value,
                      })
                    }
                    placeholder="Fecha inicial"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Fecha Final
                  </label>
                  <Input
                    type="date"
                    value={formatDateInput(resoluciones.fechaFinal)}
                    onChange={(e) =>
                      setResoluciones({
                        ...resoluciones,
                        fechaFinal: e.target.value,
                      })
                    }
                    placeholder="Fecha final"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AlertDialog de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Todo ha salido bien!</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar el tipo de documento externo "
              {resoluciones.nombreResolucion}"? Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteResoluciones}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}