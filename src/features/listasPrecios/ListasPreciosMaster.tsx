import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { IListaPrecio } from "@/types/IListaPrecio";
import { ListaPrecioService } from "@/services/ListaPrecioService";

type ListaPrecioForm = Omit<
  IListaPrecio,
  "fechaIniciaVigencia" | "fechaFinalVigencia" | "fechaGrabacionListaPrecio"
> & {
  fechaIniciaVigencia: string;
  fechaFinalVigencia: string;
  fechaGrabacionListaPrecio?: string | Date | null;
};

export default function ListasPreciosMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [listaPrecio, setListaPrecio] = useState<ListaPrecioForm>({
    codigoListaPrecio: "",
    nombreListaPrecio: "",
    fechaIniciaVigencia: "",
    fechaFinalVigencia: "",
    listaPreciosActiva: true,
    fechaGrabacionListaPrecio: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listasPrecios, setListasPrecios] = useState<IListaPrecio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchListasPrecios = async () => {
    try {
      setFetchError(null);
      setIsLoading(true);
      const data = await ListaPrecioService.getAll();
      setListasPrecios(data);
    } catch (error) {
      console.error("Error al obtener las listas de precios:", error);
      setFetchError("Error al cargar las listas de precios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListasPrecios();
  }, []);

  const handleSelectLista = (lista: IListaPrecio) => {
    setListaPrecio({
      ...lista,
      fechaIniciaVigencia: lista.fechaIniciaVigencia
        ? new Date(lista.fechaIniciaVigencia).toISOString().split("T")[0]
        : "",
      fechaFinalVigencia: lista.fechaFinalVigencia
        ? new Date(lista.fechaFinalVigencia).toISOString().split("T")[0]
        : "",
    });
    setOpenDialog(false);
  };

  const handleNew = () => {
    setListaPrecio({
      codigoListaPrecio: "",
      nombreListaPrecio: "",
      fechaIniciaVigencia: "",
      fechaFinalVigencia: "",
      listaPreciosActiva: true,
      fechaGrabacionListaPrecio: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    if (!listaPrecio.codigoListaPrecio?.trim()) {
      setFormError("El código de la lista de precios es obligatorio.");
      return;
    }
    if (!listaPrecio.nombreListaPrecio?.trim()) {
      setFormError("El nombre de la lista de precios es obligatorio.");
      return;
    }

    setFormError(null);

    const payload: IListaPrecio = {
      ...listaPrecio,
      idListaPrecio: listaPrecio.idListaPrecio ?? 0,
      fechaIniciaVigencia: listaPrecio.fechaIniciaVigencia || null,
      fechaFinalVigencia: listaPrecio.fechaFinalVigencia || null,
    };

    try {
      if (listaPrecio.idListaPrecio) {
        await ListaPrecioService.update(payload);
        setSuccessMessage("Lista de precios actualizada correctamente");
      } else {
        await ListaPrecioService.create(payload);
        setSuccessMessage("Lista de precios guardada correctamente");
      }
      setShowSuccessDialog(true);
      fetchListasPrecios();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el registro", { position: "top-center" });
    }
  };

  const handleDelete = () => {
    if (!listaPrecio.idListaPrecio) {
      toast.error("No hay una lista de precios seleccionada para eliminar", {
        position: "top-center",
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!listaPrecio.idListaPrecio) {
        toast.error("ID no válido para eliminar", { position: "top-center" });
        setShowDeleteDialog(false);
        return;
      }

      await ListaPrecioService.delete(listaPrecio.idListaPrecio);
      toast.success("Lista de precios eliminada correctamente", {
        position: "top-center",
      });

      handleNew();
      fetchListasPrecios();
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

      {/* Acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Listas de Precios</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de listas de precios y sus vigencias
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="Nueva lista de precios"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Diálogo Búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar lista de precios">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Buscar Lista de Precios</DialogTitle>
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
                      <TableHead>Inicio Vigencia</TableHead>
                      <TableHead>Fin Vigencia</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listasPrecios
                      .filter(
                        (l) =>
                          l.codigoListaPrecio
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          l.nombreListaPrecio
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((l) => (
                        <TableRow
                          key={l.idListaPrecio}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectLista(l)}
                        >
                          <TableCell>{l.codigoListaPrecio}</TableCell>
                          <TableCell>{l.nombreListaPrecio}</TableCell>
                          <TableCell>
                            {l.fechaIniciaVigencia
                              ? new Date(l.fechaIniciaVigencia).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {l.fechaFinalVigencia
                              ? new Date(l.fechaFinalVigencia).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {l.listaPreciosActiva ? "Activa" : "Inactiva"}
                          </TableCell>
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

          <Button variant="default" title="Guardar lista de precios" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          <Button variant="default" title="Eliminar lista de precios" onClick={handleDelete}>
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
              {/* Código */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Código Lista de Precio (*)
                </label>
                <Input
                  value={listaPrecio.codigoListaPrecio ?? ""}
                  onChange={(e) =>
                    setListaPrecio({
                      ...listaPrecio,
                      codigoListaPrecio: e.target.value,
                    })
                  }
                  placeholder="Código de lista"
                  className={
                    !listaPrecio.codigoListaPrecio?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
              </div>

              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Lista de Precio (*)
                </label>
                <Input
                  value={listaPrecio.nombreListaPrecio ?? ""}
                  onChange={(e) =>
                    setListaPrecio({
                      ...listaPrecio,
                      nombreListaPrecio: e.target.value,
                    })
                  }
                  placeholder="Ej: LISTA DE PRECIOS GENERAL"
                  className={
                    !listaPrecio.nombreListaPrecio?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
              </div>

              {/* Fecha Inicio Vigencia */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Fecha Inicia Vigencia
                </label>
                <Input
                  type="date"
                  value={listaPrecio.fechaIniciaVigencia}
                  onChange={(e) =>
                    setListaPrecio({
                      ...listaPrecio,
                      fechaIniciaVigencia: e.target.value,
                    })
                  }
                />
              </div>

              {/* Fecha Final Vigencia */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Fecha Final Vigencia
                </label>
                <Input
                  type="date"
                  value={listaPrecio.fechaFinalVigencia}
                  onChange={(e) =>
                    setListaPrecio({
                      ...listaPrecio,
                      fechaFinalVigencia: e.target.value,
                    })
                  }
                />
              </div>

              {/* Estado Activa */}
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="listaPreciosActiva"
                  checked={listaPrecio.listaPreciosActiva ?? false}
                  onCheckedChange={(checked) =>
                    setListaPrecio({
                      ...listaPrecio,
                      listaPreciosActiva: Boolean(checked),
                    })
                  }
                />
                <label
                  htmlFor="listaPreciosActiva"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lista de Precios Activa
                </label>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Éxito */}
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

      {/* Modal Eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la lista de precios "
              {listaPrecio.nombreListaPrecio}"? Esta acción no se puede
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