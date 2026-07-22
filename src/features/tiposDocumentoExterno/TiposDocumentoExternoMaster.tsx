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
import {
  Search,
  X,
  Save,
  Trash,
  Plus,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ITipoDocumentoExterno } from "@/types/ITipoDocumentoExterno";
import { TiposDocumentoExternoService } from "@/services/TiposDocumentoExternoService";

export default function TiposDocumentoExternoMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Estado principal para el formulario activo
  const [tipoDocExterno, setTipoDocExterno] = useState<ITipoDocumentoExterno>({
    idTipoDocumentoExterno: null,
    codigoTipoDocumentoExterno: "",
    nombreTipoDocumentoExterno: "",
    idTipoDocumento: 0,
    notaFe1Externo: "",
    notaFe2Externo: "",
    notaFe3Externo: "",
    notaFe4Externo: "",
    notaFe5Externo: "",
    fechaGrabacionDocumentoExterno: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [documentosExternos, setDocumentosExternos] = useState<ITipoDocumentoExterno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchTiposDocumentoExterno = async () => {
    try {
      setFetchError(null);
      setIsLoading(true);
      const data = await TiposDocumentoExternoService.getAll();
      setDocumentosExternos(data);
    } catch (error) {
      console.error("Error al obtener los tipos de documento externo:", error);
      setFetchError("Error al cargar los tipos de documentos externos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposDocumentoExterno();
  }, []);

  const handleSelectTipoDoc = (doc: ITipoDocumentoExterno) => {
    setTipoDocExterno({ ...doc });
    setOpenDialog(false);
  };

  const handleNew = () => {
    setTipoDocExterno({
      idTipoDocumentoExterno: null,
      codigoTipoDocumentoExterno: "",
      nombreTipoDocumentoExterno: "",
      idTipoDocumento: 0,
      notaFe1Externo: "",
      notaFe2Externo: "",
      notaFe3Externo: "",
      notaFe4Externo: "",
      notaFe5Externo: "",
      fechaGrabacionDocumentoExterno: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    // Validación de campos obligatorios
    if (!tipoDocExterno.codigoTipoDocumentoExterno?.trim()) {
      setFormError("El código de documento externo es obligatorio.");
      return;
    }
    if (!tipoDocExterno.nombreTipoDocumentoExterno?.trim()) {
      setFormError("El nombre de documento externo es obligatorio.");
      return;
    }
    if (!tipoDocExterno.idTipoDocumento) {
      setFormError("El ID Tipo Documento ERP es obligatorio.");
      return;
    }

    setFormError(null);

    try {
      if (tipoDocExterno.idTipoDocumentoExterno) {
        // Actualizar
        await TiposDocumentoExternoService.update(tipoDocExterno);
        setSuccessMessage("Tipo de documento externo actualizado correctamente");
      } else {
        // Crear
        await TiposDocumentoExternoService.create(tipoDocExterno);
        setSuccessMessage("Tipo de documento externo guardado correctamente");
      }
      setShowSuccessDialog(true);
      fetchTiposDocumentoExterno();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el registro", { position: "top-center" });
    }
  };

  const handleDelete = () => {
    if (!tipoDocExterno.idTipoDocumentoExterno) {
      toast.error("No hay un tipo de documento externo seleccionado para eliminar", {
        position: "top-center",
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!tipoDocExterno.idTipoDocumentoExterno) {
        toast.error("ID no válido para eliminar", { position: "top-center" });
        setShowDeleteDialog(false);
        return;
      }

      await TiposDocumentoExternoService.delete(tipoDocExterno.idTipoDocumentoExterno);
      toast.success("Tipo de documento externo eliminado correctamente", {
        position: "top-center",
      });

      handleNew();
      fetchTiposDocumentoExterno();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el registro", { position: "top-center" });
      setShowDeleteDialog(false);
    }
  };

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

      {/* Header y Acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Formulario Documentos Externos</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de subtipos de documentos del ERP
          </p>
        </div>
        <div className="flex gap-2">
          {/* Botón Nuevo */}
          <Button
            variant="default"
            size="icon"
            title="Nuevo tipo de documento"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Diálogo de Búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar tipo de documento externo">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Documento Externo</DialogTitle>
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
                      <TableHead>ID Tipo Doc</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentosExternos
                      .filter(
                        (doc) =>
                          doc.codigoTipoDocumentoExterno
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          doc.nombreTipoDocumentoExterno
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((doc) => (
                        <TableRow
                          key={doc.idTipoDocumentoExterno}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectTipoDoc(doc)}
                        >
                          <TableCell>{doc.codigoTipoDocumentoExterno}</TableCell>
                          <TableCell>{doc.nombreTipoDocumentoExterno}</TableCell>
                          <TableCell>{doc.idTipoDocumento}</TableCell>
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

          {/* Botón Guardar */}
          <Button
            variant="default"
            title="Guardar tipo de documento externo"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          {/* Botón Eliminar */}
          <Button
            variant="default"
            title="Eliminar tipo de documento externo"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>

          {/* Botón Salir */}
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

      {/* Formulario de Captura / Campos */}
      <Tabs defaultValue="general" className="w-full">
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Código */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Código Documento Externo (*)
                </label>
                <Input
                  value={tipoDocExterno.codigoTipoDocumentoExterno ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      codigoTipoDocumentoExterno: e.target.value,
                    })
                  }
                  placeholder="Código"
                  className={
                    !tipoDocExterno.codigoTipoDocumentoExterno?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !tipoDocExterno.codigoTipoDocumentoExterno?.trim() && (
                  <span className="text-xs text-red-500">
                    El código es obligatorio.
                  </span>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Documento Externo (*)
                </label>
                <Input
                  value={tipoDocExterno.nombreTipoDocumentoExterno ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      nombreTipoDocumentoExterno: e.target.value,
                    })
                  }
                  placeholder="Nombre"
                  className={
                    !tipoDocExterno.nombreTipoDocumentoExterno?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !tipoDocExterno.nombreTipoDocumentoExterno?.trim() && (
                  <span className="text-xs text-red-500">
                    El nombre es obligatorio.
                  </span>
                )}
              </div>

              {/* ID Tipo Documento ERP */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  ID Tipo Documento ERP (*)
                </label>
                <Input
                  type="number"
                  value={tipoDocExterno.idTipoDocumento || ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      idTipoDocumento: Number(e.target.value),
                    })
                  }
                  placeholder="ID Tipo Documento"
                  className={
                    !tipoDocExterno.idTipoDocumento && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !tipoDocExterno.idTipoDocumento && (
                  <span className="text-xs text-red-500">
                    El ID Tipo Documento es obligatorio.
                  </span>
                )}
              </div>
            </div>

            {/* Grid para las Notas FE (notaFe1Externo a notaFe5Externo) */}
            <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota FE 1
                </label>
                <Input
                  value={tipoDocExterno.notaFe1Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe1Externo: e.target.value,
                    })
                  }
                  placeholder="Nota FE 1"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota FE 2
                </label>
                <Input
                  value={tipoDocExterno.notaFe2Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe2Externo: e.target.value,
                    })
                  }
                  placeholder="Nota FE 2"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota FE 3
                </label>
                <Input
                  value={tipoDocExterno.notaFe3Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe3Externo: e.target.value,
                    })
                  }
                  placeholder="Nota FE 3"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota FE 4
                </label>
                <Input
                  value={tipoDocExterno.notaFe4Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe4Externo: e.target.value,
                    })
                  }
                  placeholder="Nota FE 4"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota FE 5
                </label>
                <Input
                  value={tipoDocExterno.notaFe5Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe5Externo: e.target.value,
                    })
                  }
                  placeholder="Nota FE 5"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AlertDialog de Éxito */}
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

      {/* AlertDialog de Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar el tipo de documento externo "
              {tipoDocExterno.nombreTipoDocumentoExterno}"? Esta acción no se puede
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