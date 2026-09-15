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
import { IUnidadDeMedida } from "@/types/IUnidadDeMedida";
import { UnidadDeMedidaService } from "@/services/UnidadDeMedidaService";

type UnidadDeMedidaForm = Omit<IUnidadDeMedida, "idUnidadMedida" | "idUnidadMedidaFe"> & {
  idUnidadMedida?: number;
  idUnidadMedidaFe: string;
};

export default function UnidadesDeMedidaMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [unidadMedida, setUnidadMedida] = useState<UnidadDeMedidaForm>({
    codigoUnidadMedida: "",
    nombreUnidadMedida: "",
    idUnidadMedidaFe: "",
    fechaGrabacionUnidadMedida: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadDeMedida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUnidadesMedida = async () => {
    try {
      setFetchError(null);
      setIsLoading(true);
      const data = await UnidadDeMedidaService.getAll();
      setUnidadesMedida(data);
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
      setFetchError("Error al cargar las unidades de medida");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const handleSelectUnidad = (unidad: IUnidadDeMedida) => {
    setUnidadMedida({
      ...unidad,
      nombreUnidadMedida: unidad.nombreUnidadMedida ?? "",
      idUnidadMedidaFe: unidad.idUnidadMedidaFe?.toString() ?? "",
    });
    setOpenDialog(false);
  };

  const handleNew = () => {
    setUnidadMedida({
      codigoUnidadMedida: "",
      nombreUnidadMedida: "",
      idUnidadMedidaFe: "",
      fechaGrabacionUnidadMedida: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    if (!unidadMedida.codigoUnidadMedida?.trim()) {
      setFormError("El código de la unidad de medida es obligatorio.");
      return;
    }

    setFormError(null);

    const payload: IUnidadDeMedida = {
      ...unidadMedida,
      idUnidadMedida: unidadMedida.idUnidadMedida ?? 0,
      idUnidadMedidaFe: unidadMedida.idUnidadMedidaFe
        ? Number(unidadMedida.idUnidadMedidaFe)
        : null,
    };

    try {
      if (unidadMedida.idUnidadMedida) {
        await UnidadDeMedidaService.update(payload);
        setSuccessMessage("Unidad de medida actualizada correctamente");
      } else {
        await UnidadDeMedidaService.create(payload);
        setSuccessMessage("Unidad de medida guardada correctamente");
      }
      setShowSuccessDialog(true);
      fetchUnidadesMedida();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el registro", { position: "top-center" });
    }
  };

  const handleDelete = () => {
    if (!unidadMedida.idUnidadMedida) {
      toast.error("No hay una unidad de medida seleccionada para eliminar", {
        position: "top-center",
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!unidadMedida.idUnidadMedida) {
        toast.error("ID no válido para eliminar", { position: "top-center" });
        setShowDeleteDialog(false);
        return;
      }

      await UnidadDeMedidaService.delete(unidadMedida.idUnidadMedida);
      toast.success("Unidad de medida eliminada correctamente", {
        position: "top-center",
      });

      handleNew();
      fetchUnidadesMedida();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el registro", { position: "top-center" });
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="p-6 bg-muted min-h-screen">
      {/* Header */}
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

      {/* Barra de Acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Unidades de Medida</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de unidades de medida
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="Nueva unidad de medida"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Diálogo de Búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar unidad de medida">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buscar Unidad de Medida</DialogTitle>
              </DialogHeader>
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
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>ID Unidad FE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unidadesMedida
                      .filter(
                        (u) =>
                          u.codigoUnidadMedida
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          u.nombreUnidadMedida
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((u) => (
                        <TableRow
                          key={u.idUnidadMedida}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectUnidad(u)}
                        >
                          <TableCell>{u.codigoUnidadMedida}</TableCell>
                          <TableCell>{u.nombreUnidadMedida || "-"}</TableCell>
                          <TableCell>{u.idUnidadMedidaFe ?? "-"}</TableCell>
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

          <Button variant="default" title="Guardar unidad de medida" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          <Button variant="default" title="Eliminar unidad de medida" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>

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

      {/* Formulario */}
      <Tabs defaultValue="general" className="w-full">
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Código Unidad Medida */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Código Unidad Medida (*)
                </label>
                <Input
                  value={unidadMedida.codigoUnidadMedida ?? ""}
                  onChange={(e) =>
                    setUnidadMedida({
                      ...unidadMedida,
                      codigoUnidadMedida: e.target.value,
                    })
                  }
                  placeholder="Ej: KGR"
                  className={
                    !unidadMedida.codigoUnidadMedida?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !unidadMedida.codigoUnidadMedida?.trim() && (
                  <span className="text-xs text-red-500 block mt-1">
                    El código es obligatorio.
                  </span>
                )}
              </div>

              {/* Nombre Unidad Medida */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Unidad Medida
                </label>
                <Input
                  value={unidadMedida.nombreUnidadMedida ?? ""}
                  onChange={(e) =>
                    setUnidadMedida({
                      ...unidadMedida,
                      nombreUnidadMedida: e.target.value,
                    })
                  }
                  placeholder="Ej: KILOGRAMO"
                />
              </div>

              {/* ID Unidad Medida FE */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  ID Unidad FE
                </label>
                <Input
                  type="number"
                  value={unidadMedida.idUnidadMedidaFe ?? ""}
                  onChange={(e) =>
                    setUnidadMedida({
                      ...unidadMedida,
                      idUnidadMedidaFe: e.target.value,
                    })
                  }
                  placeholder="Ej: 1"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
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

      {/* Modal Eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la unidad de medida "
              {unidadMedida.codigoUnidadMedida}"? Esta acción no se puede deshacer.
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