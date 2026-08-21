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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search, X, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IResoluciones } from "@/types/IResoluciones";
import { ResolucionesService } from "@/services/ResolucionesService";

export default function ResolutionsMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Helper para normalizar fechas a YYYY-MM-DD
  const formatDateInput = (date: string | Date | null | undefined): string =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  // Estado de la resolución seleccionada
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
  const [resolutions, setResolutions] = useState<IResoluciones[]>([]);
  const [isLoadingResolutions, setIsLoadingResolutions] = useState(true);
  const [resolutionsError, setResolutionsError] = useState<string | null>(null);

  const handleSelectResoluciones = (resolucion: IResoluciones) => {
    setResoluciones({ ...resolucion });
    setOpenDialog(false);
  };

  // Función para obtener la lista de resoluciones locales
  const fetchResolutions = async () => {
    try {
      setResolutionsError(null);
      setIsLoadingResolutions(true);
      const data = await ResolucionesService.getAll();
      setResolutions(data);

      // Si hay datos, carga el primero por defecto en el formulario
      if (data && data.length > 0) {
        setResoluciones(data[0]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResolutionsError("Error al cargar las resoluciones");
    } finally {
      setIsLoadingResolutions(false);
    }
  };

  // Sincronización automática de la API externa y posterior carga de datos
  useEffect(() => {
    const initializeMaster = async () => {
      try {
        setIsLoadingResolutions(true);
        await ResolucionesService.sincronizarExternas();
        toast.success("Sincronización con API externa completada");
      } catch (error) {
        console.error("Error al sincronizar con proveedor externo:", error);
        toast.error("No se pudo sincronizar con el proveedor externo");
      } finally {
        await fetchResolutions();
      }
    };

    initializeMaster();
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
            Consulta de resoluciones
          </p>
        </div>
        <div className="flex gap-2">
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
                            .includes(search.toLowerCase())
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
                    Cargando resoluciones...
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
            size="icon"
            title="Salir"
            onClick={() => navigate("/main-menu")}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Formulario principal (Modo lectura) */}
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
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre de la Resolución
                </label>
                <Input
                  value={resoluciones.nombreResolucion ?? ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Clave Técnica
                </label>
                <Input
                  value={resoluciones.claveTecnica ?? ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Vigencia (meses)
                </label>
                <Input
                  type="number"
                  value={resoluciones.vigenciaMeses || ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Prefijo Resolución
                </label>
                <Input
                  value={resoluciones.prefijoResolucion ?? ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número Inicial
                </label>
                <Input
                  type="number"
                  value={resoluciones.numeroInicialResolucion || ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número Final
                </label>
                <Input
                  type="number"
                  value={resoluciones.numeroFinalResolucion || ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Número Actual
                </label>
                <Input
                  type="number"
                  value={resoluciones.numeroActual || ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
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
                    disabled
                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded cursor-not-allowed"
                  />
                  <span className="text-sm text-muted-foreground">
                    {resoluciones.resolucionActiva ? "Sí" : "No"}
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
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Fecha Inicial
                  </label>
                  <Input
                    type="date"
                    value={formatDateInput(resoluciones.fechaInicial)}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Fecha Final
                  </label>
                  <Input
                    type="date"
                    value={formatDateInput(resoluciones.fechaFinal)}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}