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
  AlertDialogCancel,
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
import { ITipoDocumento } from "@/types/ITipoDocumento";
import { TipoDocumentoService } from "@/services/TipoDocumentoService";
import { IFormasPago } from "@/types/IFormasPago";
import { IConsecutivos } from "@/types/IConsecutivos";
import { FormasPagoService } from "@/services/FormasPagoService";
import { ConsecutivosService } from "@/services/ConsecutivosService";

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
    idConsecutivo: null,
    idFormaPago: null,
    tipoDocumentoActivo: true,
    fechaGrabacionDocumentoExterno: null,
  });

  const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumento[]>([]);
  const [formasPago, setFormasPago] = useState<IFormasPago[]>([]);
  const [consecutivos, setConsecutivos] = useState<IConsecutivos[]>([]);

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

  const fetchTiposDocumento = async () => {
    try {
      const data = await TipoDocumentoService.getAll();
      setTiposDocumento(data);
    } catch (error) {
      console.error("Error al obtener los tipos de documento base:", error);
    }
  };

  const fetchFormasPago = async () => {
    try {
      const data = await FormasPagoService.getAll();
      setFormasPago(data);
    } catch (error) {
      console.error("Error al cargar formas de pago:", error);
    }
  };

  const fetchConsecutivos = async () => {
    try {
      const data = await ConsecutivosService.getAll();
      setConsecutivos(data);
    } catch (error) {
      console.error("Error al cargar consecutivos:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchTiposDocumentoExterno(),
        fetchTiposDocumento(),
        fetchFormasPago(),
        fetchConsecutivos(),
      ]);
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  const handleSelectTipoDoc = (doc: ITipoDocumentoExterno) => {
    setTipoDocExterno({ ...doc });
    setFormError(null);
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
      idConsecutivo: null,
      idFormaPago: null,
      tipoDocumentoActivo: true,
      fechaGrabacionDocumentoExterno: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    if (!tipoDocExterno.codigoTipoDocumentoExterno?.trim()) {
      setFormError("El código de documento externo es obligatorio.");
      return;
    }
    if (!tipoDocExterno.nombreTipoDocumentoExterno?.trim()) {
      setFormError("El nombre de documento externo es obligatorio.");
      return;
    }
    if (!tipoDocExterno.idTipoDocumento) {
      setFormError("El ID Tipo Documento es obligatorio.");
      return;
    }

    setFormError(null);

    try {
      if (tipoDocExterno.idTipoDocumentoExterno) {
        await TiposDocumentoExternoService.update(tipoDocExterno);
        setSuccessMessage("Tipo de documento actualizado correctamente");
      } else {
        await TiposDocumentoExternoService.create(tipoDocExterno);
        setSuccessMessage("Tipo de documento guardado correctamente");
      }
      setShowSuccessDialog(true);
      await fetchTiposDocumentoExterno();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el registro", { position: "top-center" });
    }
  };

  const handleDelete = () => {
    if (!tipoDocExterno.idTipoDocumentoExterno) {
      toast.error("No hay un tipo de documento seleccionado para eliminar", {
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
      toast.success("Tipo de documento eliminado correctamente", {
        position: "top-center",
      });

      handleNew();
      await fetchTiposDocumentoExterno();
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
          {/* REQUERIMIENTO TAIGA: Cambiar el nombre a Tipos de Documento */}
          <h2 className="text-2xl font-bold">Tipos de Documento</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de tipos de documento
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="Nuevo documento"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar documento">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Tipo de Documento</DialogTitle>
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

          <Button
            variant="default"
            title="Guardar documento"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          <Button
            variant="default"
            title="Eliminar documento"
            onClick={handleDelete}
          >
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

      {/* Formulario de Captura / Campos */}
      <Tabs defaultValue="general" className="w-full">
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Código Documento */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Código Documento (*)
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
                  <span className="text-xs text-red-500 block mt-1">
                    El código es obligatorio.
                  </span>
                )}
              </div>

              {/* Nombre Documento */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Documento (*)
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
                  <span className="text-xs text-red-500 block mt-1">
                    El nombre es obligatorio.
                  </span>
                )}
              </div>

              {/* Tipo Documento */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Tipo Documento (*)
                </label>
                <select
                  className={`w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary ${
                    !tipoDocExterno.idTipoDocumento && formError
                      ? "border-red-500"
                      : "border-input"
                  }`}
                  value={tipoDocExterno.idTipoDocumento || ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      idTipoDocumento: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Seleccione un tipo de documento...</option>
                  {tiposDocumento?.map((doc: ITipoDocumento) => (
                    <option key={doc.idTipoDocumento ?? `doc-${doc.codigoDocumento}`} value={doc.idTipoDocumento}>
                      {doc.nombreDocumento || "Sin nombre"}
                    </option>
                  ))}
                </select>
                {formError && !tipoDocExterno.idTipoDocumento && (
                  <span className="text-xs text-red-500 block mt-1">
                    Tipo Documento es obligatorio.
                  </span>
                )}
              </div>

               {/* Forma de Pago */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Forma de Pago
                </label>
                <select
                  className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-2 focus:ring-primary"
                  value={tipoDocExterno.idFormaPago ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      idFormaPago: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">Seleccione una forma de pago</option>
                  {formasPago?.map((fp: IFormasPago) => (
                    <option key={fp.idFormaPago} value={fp.idFormaPago}>
                      {fp.nombreFormaPago || fp.codigoFormaPago || `Forma ${fp.idFormaPago}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consecutivo */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Consecutivo
                </label>
                <select
                  className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-2 focus:ring-primary"
                  value={tipoDocExterno.idConsecutivo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      idConsecutivo: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">Seleccione un consecutivo</option>
                  {consecutivos?.map((c: IConsecutivos) => (
                    <option key={c.idConsecutivo} value={c.idConsecutivo}>
                      {c.nombreConsecutivo || c.prefijoConsecutivo || `Consecutivo ${c.idConsecutivo}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>  

            {/* Grid para las Notas FE */}
            <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota Facturación Electrónica 1
                </label>
                <Input
                  value={tipoDocExterno.notaFe1Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe1Externo: e.target.value,
                    })
                  }
                  placeholder="Nota Facturación Electrónica 1"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota Facturación Electrónica 2
                </label>
                <Input
                  value={tipoDocExterno.notaFe2Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe2Externo: e.target.value,
                    })
                  }
                  placeholder="Nota Facturación Electrónica 2"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota Facturación Electrónica 3
                </label>
                <Input
                  value={tipoDocExterno.notaFe3Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe3Externo: e.target.value,
                    })
                  }
                  placeholder="Nota Facturación Electrónica 3"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota Facturación Electrónica 4
                </label>
                <Input
                  value={tipoDocExterno.notaFe4Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe4Externo: e.target.value,
                    })
                  }
                  placeholder="Nota Facturación Electrónica 4"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nota Facturación Electrónica 5
                </label>
                <Input
                  value={tipoDocExterno.notaFe5Externo ?? ""}
                  onChange={(e) =>
                    setTipoDocExterno({
                      ...tipoDocExterno,
                      notaFe5Externo: e.target.value,
                    })
                  }
                  placeholder="Nota Facturación Electrónica 5"
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
              ¿Está seguro que desea eliminar el tipo de documento "
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