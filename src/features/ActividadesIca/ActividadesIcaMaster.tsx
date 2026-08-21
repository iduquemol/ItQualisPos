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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search, X, Save, Trash, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IActividadesIca } from "@/types/IActividadesIca";
import { ActividadesIcaService } from "@/services/ActividadesIcaService";

export default function ActividadesIcaMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Estado del formulario alineado con IActividadesIca
  const [actividadIca, setActividadIca] = useState<IActividadesIca>({
    idActividadIca: undefined,
    codigoActividadIca: "",
    descripcionActividadIca: "",
    tarifaActividad: "",
    idExterno: "",
    fechaGrabacionActividadIca: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actividadesIca, setActividadesIca] = useState<IActividadesIca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchActividadesIca = async () => {
    try {
      setFetchError(null);
      setIsLoading(true);
      const data = await ActividadesIcaService.getAll();
      setActividadesIca(data);
    } catch (error) {
      console.error("Error al obtener las actividades ICA:", error);
      setFetchError("Error al cargar las actividades ICA");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActividadesIca();
  }, []);

  const handleSelectActividad = (act: IActividadesIca) => {
    setActividadIca({ ...act });
    setOpenDialog(false);
  };

  const handleNew = () => {
    setActividadIca({
      idActividadIca: undefined,
      codigoActividadIca: "",
      descripcionActividadIca: "",
      tarifaActividad: "",
      idExterno: "",
      fechaGrabacionActividadIca: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    // Validaciones básicas de campos requeridos
    if (
      actividadIca.codigoActividadIca === "" ||
      actividadIca.codigoActividadIca === null ||
      actividadIca.codigoActividadIca === undefined
    ) {
      setFormError("El código de la actividad ICA es obligatorio.");
      return;
    }
    if (!actividadIca.descripcionActividadIca?.trim()) {
      setFormError("La descripción de la actividad ICA es obligatoria.");
      return;
    }
    if (
      actividadIca.tarifaActividad === "" ||
      actividadIca.tarifaActividad === null ||
      actividadIca.tarifaActividad === undefined
    ) {
      setFormError("La tarifa de la actividad ICA es obligatoria.");
      return;
    }

    setFormError(null);

    // Mapeo seguro casteando valores según tu modelo (number | string)
    const payload: IActividadesIca = {
      ...actividadIca,
      codigoActividadIca: Number(actividadIca.codigoActividadIca),
      tarifaActividad: Number(actividadIca.tarifaActividad),
    };

    try {
      if (actividadIca.idActividadIca) {
        // Actualizar existente
        await ActividadesIcaService.update(payload);
        setSuccessMessage("Actividad ICA actualizada correctamente");
      } else {
        // Crear nuevo
        await ActividadesIcaService.create(payload);
        setSuccessMessage("Actividad ICA guardada correctamente");
      }
      setShowSuccessDialog(true);
      fetchActividadesIca();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el registro", { position: "top-center" });
    }
  };

  const handleDelete = () => {
    if (!actividadIca.idActividadIca) {
      toast.error("No hay una actividad ICA seleccionada para eliminar", {
        position: "top-center",
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!actividadIca.idActividadIca) {
        toast.error("ID no válido para eliminar", { position: "top-center" });
        setShowDeleteDialog(false);
        return;
      }

      await ActividadesIcaService.delete(actividadIca.idActividadIca);
      toast.success("Actividad ICA eliminada correctamente", {
        position: "top-center",
      });

      handleNew();
      fetchActividadesIca();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el registro", { position: "top-center" });
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="p-6 bg-muted min-h-screen">
      {/* Header con identidad visual del sistema */}
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

      {/* Barra de Acciones del Formulario */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Actividades ICA</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de actividades económicas e impuesto de ICA
          </p>
        </div>
        <div className="flex gap-2">
          {/* Nuevo */}
          <Button
            variant="default"
            size="icon"
            title="Nueva actividad ICA"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Diálogo de Búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar actividad ICA">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buscar Actividad ICA</DialogTitle>
              </DialogHeader>
              <Input
                className="mb-4"
                placeholder="Buscar por código o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Tarifa</TableHead>
                      <TableHead>ID Externo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actividadesIca
                      .filter(
                        (act) =>
                          act.codigoActividadIca
                            ?.toString()
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          act.descripcionActividadIca
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((act) => (
                        <TableRow
                          key={act.idActividadIca}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectActividad(act)}
                        >
                          <TableCell>{act.codigoActividadIca}</TableCell>
                          <TableCell>{act.descripcionActividadIca}</TableCell>
                          <TableCell>{act.tarifaActividad}</TableCell>
                          <TableCell>{act.idExterno || "-"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {isLoading && (
                  <div className="text-center text-muted-foreground py-4">
                    Cargando...
                  </div>
                )}
                {fetchError && (
                  <div className="text-center text-red-500 py-4">
                    {fetchError}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Guardar */}
          <Button
            variant="default"
            title="Guardar actividad ICA"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          {/* Eliminar */}
          <Button
            variant="default"
            title="Eliminar actividad ICA"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>

          {/* Salir */}
          <Button
            variant="default"
            size="icon"
            title="Salir"
            onClick={() => navigate("/main-menu")}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Contenido del Formulario */}
      <Tabs defaultValue="general" className="w-full">
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Código Actividad ICA */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Código Actividad ICA (*)
                </label>
                <Input
                  type="number"
                  value={actividadIca.codigoActividadIca ?? ""}
                  onChange={(e) =>
                    setActividadIca({
                      ...actividadIca,
                      codigoActividadIca: e.target.value,
                    })
                  }
                  placeholder="Ej: 2591"
                  className={
                    (!actividadIca.codigoActividadIca ||
                      actividadIca.codigoActividadIca === "") &&
                    formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError &&
                  (!actividadIca.codigoActividadIca ||
                    actividadIca.codigoActividadIca === "") && (
                    <span className="text-xs text-red-500 block mt-1">
                      El código es obligatorio.
                    </span>
                  )}
              </div>

              {/* Tarifa Actividad */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Tarifa Actividad (*)
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={actividadIca.tarifaActividad ?? ""}
                  onChange={(e) =>
                    setActividadIca({
                      ...actividadIca,
                      tarifaActividad: e.target.value,
                    })
                  }
                  placeholder="Ej: 7"
                  className={
                    (!actividadIca.tarifaActividad ||
                      actividadIca.tarifaActividad === "") &&
                    formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError &&
                  (!actividadIca.tarifaActividad ||
                    actividadIca.tarifaActividad === "") && (
                    <span className="text-xs text-red-500 block mt-1">
                      La tarifa es obligatoria.
                    </span>
                  )}
              </div>

              {/* ID Externo */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  ID Externo
                </label>
                <Input
                  value={actividadIca.idExterno ?? ""}
                  onChange={(e) =>
                    setActividadIca({
                      ...actividadIca,
                      idExterno: e.target.value,
                    })
                  }
                  placeholder="Ej: 2591"
                />
              </div>

              {/* Descripción Actividad ICA */}
              <div className="md:col-span-3">
                <label className="block text-xs text-muted-foreground mb-1">
                  Descripción Actividad ICA (*)
                </label>
                <Input
                  value={actividadIca.descripcionActividadIca ?? ""}
                  onChange={(e) =>
                    setActividadIca({
                      ...actividadIca,
                      descripcionActividadIca: e.target.value,
                    })
                  }
                  placeholder="Ej: ACTIVIDAD ECONOMICA TARIFA 7 * 1000"
                  className={
                    !actividadIca.descripcionActividadIca?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !actividadIca.descripcionActividadIca?.trim() && (
                  <span className="text-xs text-red-500 block mt-1">
                    La descripción es obligatoria.
                  </span>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de guardado */}
      <AlertDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Operación Exitosa!</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la actividad ICA "
              {actividadIca.descripcionActividadIca}"? Esta acción no se puede
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
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}