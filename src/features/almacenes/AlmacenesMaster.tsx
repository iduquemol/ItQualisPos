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
import { Search, X, Save, Trash, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IAlmacen } from "@/types/IAlmacen";
import { AlmacenesService } from "@/services/AlmacenesService";
import { SucursalService } from "@/services/SucursalService";
import { ISucursales } from "@/types/ISucursales";
import { TerceroService } from "@/services/TerceroService";
import { ITercero } from "@/types/ITercero";

type AlmacenForm = Omit<IAlmacen, "idAlmacen" | "idSucursal" | "idTerceroResponsable"> & {
  idAlmacen?: number;
  idSucursal: string;
  idTerceroResponsable: string;
};

export default function AlmacenesMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [almacen, setAlmacen] = useState<AlmacenForm>({
    codigoAlmacen: "",
    nombreAlmacen: "",
    idSucursal: "",
    direccionAlmacen: "",
    idTerceroResponsable: "",
    fechaGrabacionAlmacen: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [almacenes, setAlmacenes] = useState<IAlmacen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sucursales, setSucursales] = useState<ISucursales[]>([]);
  const [isLoadingSucursales, setIsLoadingSucursales] = useState(true);
  const [sucursalError, setSucursalError] = useState<string | null>(null);
  const [openTerceroDialog, setOpenTerceroDialog] = useState(false);
  const [searchTercero, setSearchTercero] = useState("");
  const [terceros, setTerceros] = useState<ITercero[]>([]);
  const [isLoadingTerceros, setIsLoadingTerceros] = useState(false);
  const [terceroError, setTerceroError] = useState<string | null>(null);
  const [nombreTerceroResponsable, setNombreTerceroResponsable] = useState("");

  const fetchAlmacenes = async () => {
    try {
      setFetchError(null);
      setIsLoading(true);
      const data = await AlmacenesService.getAll();
      setAlmacenes(data);
    } catch (error) {
      console.error("Error al obtener almacenes:", error);
      setFetchError("Error al cargar la lista de almacenes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        setSucursalError(null);
        setSucursales(await SucursalService.getAll());
      } catch (error) {
        console.error("Error al obtener sucursales:", error);
        setSucursalError("Error al cargar las sucursales");
      } finally {
        setIsLoadingSucursales(false);
      }
    };

    fetchSucursales();
  }, []);

  const getNombreTercero = (tercero: ITercero) =>
    tercero.razonSocial?.trim() ||
    [tercero.primerNombre, tercero.segundoNombre, tercero.primerApellido, tercero.segundoApellido]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    tercero.numeroIdentificacion;

  const loadTerceros = async () => {
    setIsLoadingTerceros(true);
    setTerceroError(null);

    try {
      setTerceros(await TerceroService.getAll());
    } catch (error) {
      console.error("Error al cargar terceros:", error);
      setTerceroError("Error al cargar terceros");
      setTerceros([]);
    } finally {
      setIsLoadingTerceros(false);
    }
  };

  const handleSelectAlmacen = (item: IAlmacen) => {
    setAlmacen({
      ...item,
      idSucursal: item.idSucursal?.toString() ?? "",
      idTerceroResponsable: item.idTerceroResponsable?.toString() ?? "",
      direccionAlmacen: item.direccionAlmacen ?? "",
    });
    setNombreTerceroResponsable(
      item.razonSocial ||
      (item.idTerceroResponsable ? `ID: ${item.idTerceroResponsable}` : "")
    );
    setOpenDialog(false);
    setFormError(null);
  };

  const handleSelectTercero = (tercero: ITercero) => {
    setAlmacen((prev) => ({
      ...prev,
      idTerceroResponsable: tercero.idTercero.toString(),
    }));
    setNombreTerceroResponsable(getNombreTercero(tercero));
    setOpenTerceroDialog(false);
    setSearchTercero("");
  };

  const handleNew = () => {
    setAlmacen({
      codigoAlmacen: "",
      nombreAlmacen: "",
      idSucursal: "",
      direccionAlmacen: "",
      idTerceroResponsable: "",
      fechaGrabacionAlmacen: null,
    });
    setNombreTerceroResponsable("");
    setFormError(null);
  };

  const handleSave = async () => {
    // Validaciones de campos obligatorios
    if (!almacen.codigoAlmacen?.trim()) {
      setFormError("El código del almacén es obligatorio.");
      return;
    }
    if (!almacen.nombreAlmacen?.trim()) {
      setFormError("El nombre del almacén es obligatorio.");
      return;
    }
    if (!Number.isInteger(Number(almacen.idSucursal)) || Number(almacen.idSucursal) <= 0) {
      setFormError("La sucursal es obligatoria.");
      return;
    }

    setFormError(null);

    // Mapeo al contrato de la API
    const payload: IAlmacen = {
      idAlmacen: almacen.idAlmacen ?? 0,
      codigoAlmacen: almacen.codigoAlmacen.trim(),
      nombreAlmacen: almacen.nombreAlmacen.trim(),
      idSucursal: Number(almacen.idSucursal),
      idTerceroResponsable: almacen.idTerceroResponsable ? Number(almacen.idTerceroResponsable) : null,
      direccionAlmacen: almacen.direccionAlmacen?.trim() || null,
      fechaGrabacionAlmacen: almacen.fechaGrabacionAlmacen ?? null,
    };

    try {
      if (almacen.idAlmacen) {
        // Actualizar existente
        await AlmacenesService.update(payload);
        setSuccessMessage("Almacén actualizado correctamente");
      } else {
        // Crear nuevo
        await AlmacenesService.create(payload);
        setSuccessMessage("Almacén guardado correctamente");
      }
      setShowSuccessDialog(true);
      await fetchAlmacenes();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el registro", { position: "top-center" });
    }
  };

  const handleDelete = () => {
    if (!almacen.idAlmacen) {
      toast.error("No hay un almacén seleccionado para eliminar", {
        position: "top-center",
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!almacen.idAlmacen) {
        toast.error("ID no válido para eliminar", { position: "top-center" });
        setShowDeleteDialog(false);
        return;
      }

      await AlmacenesService.delete(almacen.idAlmacen);
      toast.success("Almacén eliminado correctamente", {
        position: "top-center",
      });

      handleNew();
      fetchAlmacenes();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el registro", { position: "top-center" });
      setShowDeleteDialog(false);
    }
  };

  const tercerosFiltrados = terceros.filter((tercero) => {
    const query = searchTercero.trim().toLocaleLowerCase();
    const nombre = [
      tercero.primerNombre,
      tercero.segundoNombre,
      tercero.primerApellido,
      tercero.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ");
    const valoresBusqueda = [
      tercero.numeroIdentificacion,
      nombre,
      tercero.razonSocial,
    ];

    return valoresBusqueda.some((valor) =>
      valor?.toLocaleLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 bg-muted min-h-screen">
      {/* Barra de Acciones del Formulario */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Maestro de Almacenes</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de depósitos y almacenes
          </p>
        </div>
        <div className="flex gap-2">
          {/* Nuevo */}
          <Button
            variant="default"
            size="icon"
            title="Nuevo almacén"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Diálogo de Búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar almacén">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Buscar Almacén</DialogTitle>
              </DialogHeader>
              <Input
                className="mb-4"
                placeholder="Buscar por código, nombre o dirección..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Sucursal</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Responsable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {almacenes
                      .filter(
                        (item) =>
                          item.codigoAlmacen
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          item.nombreAlmacen
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          item.direccionAlmacen
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((item) => (
                        <TableRow
                          key={item.idAlmacen}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectAlmacen(item)}
                        >
                          <TableCell>{item.codigoAlmacen}</TableCell>
                          <TableCell>{item.nombreAlmacen}</TableCell>
                          <TableCell>{item.nombreSucursal || item.idSucursal}</TableCell>
                          <TableCell>{item.direccionAlmacen || "-"}</TableCell>
                          <TableCell>{item.razonSocial || item.idTerceroResponsable || "-"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {isLoading && (
                  <div className="text-center text-muted-foreground py-4">
                    Cargando almacenes...
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
            title="Guardar almacén"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          {/* Eliminar */}
          <Button
            variant="default"
            title="Eliminar almacén"
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
              {/* Código Almacén */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Código Almacén (*)
                </label>
                <Input
                  value={almacen.codigoAlmacen ?? ""}
                  onChange={(e) =>
                    setAlmacen({
                      ...almacen,
                      codigoAlmacen: e.target.value,
                    })
                  }
                  placeholder="Ej: ALM-01"
                  className={
                    !almacen.codigoAlmacen?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !almacen.codigoAlmacen?.trim() && (
                  <span className="text-xs text-red-500 block mt-1">
                    El código es obligatorio.
                  </span>
                )}
              </div>

              {/* Nombre Almacén */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Almacén (*)
                </label>
                <Input
                  value={almacen.nombreAlmacen ?? ""}
                  onChange={(e) =>
                    setAlmacen({
                      ...almacen,
                      nombreAlmacen: e.target.value,
                    })
                  }
                  placeholder="Ej: Bodega Principal"
                  className={
                    !almacen.nombreAlmacen?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !almacen.nombreAlmacen?.trim() && (
                  <span className="text-xs text-red-500 block mt-1">
                    El nombre es obligatorio.
                  </span>
                )}
              </div>

              {/* Sucursal */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Sucursal (*)
                </label>
                <select
                  value={almacen.idSucursal}
                  onChange={(e) => {
                    setAlmacen({ ...almacen, idSucursal: e.target.value });
                    setFormError(null);
                  }}
                  className={
                    `w-full rounded-md border bg-background px-3 py-2 text-sm ${formError && (!Number.isInteger(Number(almacen.idSucursal)) || Number(almacen.idSucursal) <= 0)
                      ? "border-red-500"
                      : "border-input"}`
                  }
                  disabled={isLoadingSucursales || Boolean(sucursalError)}
                  required
                >
                  <option value="">
                    {isLoadingSucursales ? "Cargando sucursales..." : "Seleccione una sucursal"}
                  </option>
                  {almacen.idSucursal &&
                    !sucursales.some((sucursal) => sucursal.idSucursal.toString() === almacen.idSucursal) && (
                      <option value={almacen.idSucursal}>
                        Sucursal {almacen.idSucursal} (no disponible)
                      </option>
                    )}
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                      {[sucursal.codigoSucursal, sucursal.nombreSucursal]
                        .filter(Boolean)
                        .join(" - ") || `Sucursal ${sucursal.idSucursal}`}
                    </option>
                  ))}
                </select>
                {formError && (!Number.isInteger(Number(almacen.idSucursal)) || Number(almacen.idSucursal) <= 0) && (
                  <span className="text-xs text-red-500 block mt-1">
                    La sucursal es obligatoria.
                  </span>
                )}
                {sucursalError && (
                  <span className="text-xs text-red-500 block mt-1">{sucursalError}</span>
                )}
                {!isLoadingSucursales && !sucursalError && sucursales.length === 0 && (
                  <span className="text-xs text-muted-foreground block mt-1">
                    No hay sucursales disponibles.
                  </span>
                )}
              </div>

              {/* Dirección Almacén */}
              <div className="md:col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">
                  Dirección
                </label>
                <Input
                  value={almacen.direccionAlmacen ?? ""}
                  onChange={(e) =>
                    setAlmacen({
                      ...almacen,
                      direccionAlmacen: e.target.value,
                    })
                  }
                  placeholder="Ej: Calle 100 # 15-20"
                />
              </div>

              {/* Tercero Responsable */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Tercero responsable
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={nombreTerceroResponsable}
                    placeholder="Seleccione un tercero responsable"
                    readOnly
                  />
                  {almacen.idTerceroResponsable && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Quitar tercero responsable"
                      onClick={() => {
                        setAlmacen({ ...almacen, idTerceroResponsable: "" });
                        setNombreTerceroResponsable("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Dialog
                    open={openTerceroDialog}
                    onOpenChange={(isOpen) => {
                      setOpenTerceroDialog(isOpen);
                      if (isOpen) {
                        setSearchTercero("");
                        void loadTerceros();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Buscar tercero responsable"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Seleccionar tercero responsable</DialogTitle>
                      </DialogHeader>
                      <Input
                        className="mb-4"
                        placeholder="Buscar por identificación o nombre..."
                        value={searchTercero}
                        onChange={(e) => setSearchTercero(e.target.value)}
                      />
                      <div className="overflow-x-auto max-h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Identificación</TableHead>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Razón social</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tercerosFiltrados.map((tercero) => (
                              <TableRow
                                key={tercero.idTercero}
                                className="cursor-pointer hover:bg-primary/10"
                                onClick={() => handleSelectTercero(tercero)}
                              >
                                <TableCell>{tercero.numeroIdentificacion}</TableCell>
                                <TableCell>
                                  {[tercero.primerNombre, tercero.segundoNombre, tercero.primerApellido, tercero.segundoApellido]
                                    .filter(Boolean)
                                    .join(" ")}
                                </TableCell>
                                <TableCell>{tercero.razonSocial || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {isLoadingTerceros && (
                          <div className="text-center text-muted-foreground py-4">
                            Cargando terceros...
                          </div>
                        )}
                        {!isLoadingTerceros && tercerosFiltrados.length === 0 && !terceroError && (
                          <div className="text-center text-muted-foreground py-4">
                            No se encontraron terceros.
                          </div>
                        )}
                        {terceroError && (
                          <div className="text-center text-red-500 py-4">{terceroError}</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
              ¿Está seguro que desea eliminar el almacén "
              {almacen.nombreAlmacen}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
          </AlertDialogFooter>
          <AlertDialogFooter>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}