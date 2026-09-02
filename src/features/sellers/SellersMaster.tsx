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
import { Check, CircleX, Pencil, Search, X, Save, Trash, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IVendedores } from "@/types/IVendedores";
import { VendedorService } from "@/services/VendedorService";
import { TerceroService } from "@/services/TerceroService";
import { ITercero } from "@/types/ITercero";

export default function SellersMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [vendedor, setVendedor] = useState<IVendedores>({
    idVendedor: 0,
    codigoVendedor: "",
    nombreVendedor: "",
    idTerceroVendedor: null,
    fechaGrabacionVendedor: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [openTerceroDialog, setOpenTerceroDialog] = useState(false);
  const [searchTercero, setSearchTercero] = useState("");
  const [terceros, setTerceros] = useState<ITercero[]>([]);
  const [isLoadingTerceros, setIsLoadingTerceros] = useState(false);
  const [terceroError, setTerceroError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vendedoresList, setVendedoresList] = useState<IVendedores[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendedores = async () => {
    try {
      setIsLoading(true);
      const data = await VendedorService.getAll();
      setVendedoresList(data);
    } catch (error) {
      toast.error("Error al cargar vendedores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendedores();
  }, []);

  const loadTerceros = async (query = "") => {
    setIsLoadingTerceros(true);
    setTerceroError(null);

    try {
      const data = await TerceroService.search(query.trim());
      setTerceros(data);
    } catch (error) {
      setTerceroError("Error al buscar terceros");
      setTerceros([]);
    } finally {
      setIsLoadingTerceros(false);
    }
  };

  const handleSelectVendedor = (item: IVendedores) => {
    setVendedor(item);
    setOpenDialog(false);
  };

  const handleSelectTercero = (tercero: ITercero) => {
    const nombreTercero = tercero.razonSocial?.trim() || [tercero.primerNombre, tercero.primerApellido].filter(Boolean).join(" ").trim();

    setVendedor((prev) => ({
      ...prev,
      idTerceroVendedor: tercero.idTercero ?? null,
      nombreVendedor: nombreTercero || prev.nombreVendedor || "",
    }));
    setOpenTerceroDialog(false);
    setSearchTercero("");
    setTerceros([]);
  };

  const handleNew = () => {
    setVendedor({
      idVendedor: 0,
      codigoVendedor: "",
      nombreVendedor: "",
      idTerceroVendedor: null,
      fechaGrabacionVendedor: null,
    });
    setFormError(null);
  };

  const handleSave = async () => {
    if (!vendedor.codigoVendedor?.trim()) {
      setFormError("El código del vendedor es obligatorio.");
      return;
    }
    if (!vendedor.nombreVendedor?.trim()) {
      setFormError("El nombre del vendedor es obligatorio.");
      return;
    }

    setFormError(null);

    const payload: IVendedores = {
      ...vendedor,
      idTerceroVendedor: vendedor.idTerceroVendedor ?? null,
    };

    try {
      if (vendedor.idVendedor) {
        await VendedorService.update(payload);
        setSuccessMessage("Vendedor actualizado correctamente.");
      } else {
        await VendedorService.create(payload);
        setSuccessMessage("Vendedor guardado correctamente.");
      }
      setShowSuccessDialog(true);
      fetchVendedores();
    } catch (error) {
      toast.error("Error al guardar el vendedor");
    }
  };

  const handleDelete = () => {
    if (!vendedor.idVendedor) {
      toast.error("No hay un vendedor seleccionado para eliminar");
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (vendedor.idVendedor) {
        await VendedorService.delete(vendedor.idVendedor);
        toast.success("Vendedor eliminado correctamente");
        handleNew();
        fetchVendedores();
      }
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Error al eliminar el vendedor");
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
          <h2 className="text-2xl font-bold">Maestro de Vendedores</h2>
          <p className="text-muted-foreground text-sm">
            Gestión de vendedores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="icon" title="Nuevo vendedor" onClick={handleNew}>
            <Plus className="w-5 h-5" />
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar vendedor">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Vendedor</DialogTitle>
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
                    {vendedoresList
                      .filter(
                        (v) =>
                          v.codigoVendedor?.toLowerCase().includes(search.toLowerCase()) ||
                          v.nombreVendedor?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((v) => (
                        <TableRow
                          key={v.idVendedor}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectVendedor(v)}
                        >
                          <TableCell>{v.codigoVendedor}</TableCell>
                          <TableCell>{v.nombreVendedor}</TableCell>
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
              Código Vendedor (*)
            </label>
            <Input
              value={vendedor.codigoVendedor ?? ""}
              onChange={(e) => {
                setVendedor({ ...vendedor, codigoVendedor: e.target.value });
                setFormError(null);
              }}
              placeholder="Código del vendedor"
              className={formError && !vendedor.codigoVendedor?.trim() ? "border-red-500" : ""}
            />
            {formError && !vendedor.codigoVendedor?.trim() && (
              <span className="text-xs text-red-500">{formError}</span>
            )}
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Nombre Vendedor (*)
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={vendedor.nombreVendedor ?? ""}
                onChange={(e) => {
                  setVendedor({ ...vendedor, nombreVendedor: e.target.value });
                  setFormError(null);
                }}
                placeholder="Nombre del vendedor"
                className={formError && !vendedor.nombreVendedor?.trim() ? "border-red-500" : ""}
              />
              <Dialog open={openTerceroDialog} onOpenChange={(isOpen) => {
                setOpenTerceroDialog(isOpen);
                if (isOpen) {
                  setSearchTercero("");
                  void loadTerceros("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" title="Buscar tercero" type="button">
                    <Search className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Buscar Tercero</DialogTitle>
                  </DialogHeader>
                  <Input
                    className="mb-4"
                    placeholder="Buscar por identificación o nombre o razón social..."
                    value={searchTercero}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTercero(value);
                      void loadTerceros(value);
                    }}
                  />
                  <div className="overflow-x-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Identificación</TableHead>
                          <TableHead>Primer Nombre</TableHead>
                          <TableHead>Primer Apellido</TableHead>
                          <TableHead>Razón Social</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {terceros
                          .filter((tercero) =>
                            tercero.numeroIdentificacion?.toLowerCase().includes(searchTercero.toLowerCase()) ||
                            tercero.primerNombre?.toLowerCase().includes(searchTercero.toLowerCase()) ||
                            tercero.primerApellido?.toLowerCase().includes(searchTercero.toLowerCase()) ||
                            tercero.razonSocial?.toLowerCase().includes(searchTercero.toLowerCase())
                          )
                          .map((tercero) => (
                            <TableRow
                              key={tercero.idTercero ?? `${tercero.numeroIdentificacion}-${tercero.primerNombre}`}
                              className="cursor-pointer hover:bg-primary/10"
                              onClick={() => handleSelectTercero(tercero)}
                            >
                              <TableCell>{tercero.numeroIdentificacion}</TableCell>
                              <TableCell>{tercero.primerNombre}</TableCell>
                              <TableCell>{tercero.primerApellido}</TableCell>
                              <TableCell>{tercero.razonSocial}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {isLoadingTerceros && <div className="text-center py-4">Cargando...</div>}
                    {!isLoadingTerceros && terceros.length === 0 && !terceroError && (
                      <div className="text-center py-4 text-muted-foreground">No se encontraron terceros.</div>
                    )}
                    {terceroError && <div className="text-center text-red-500 py-4">{terceroError}</div>}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {formError && !vendedor.nombreVendedor?.trim() && (
              <span className="text-xs text-red-500">{formError}</span>
            )}
          </div>
        </div>
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
              ¿Está seguro que desea eliminar al vendedor "{vendedor.nombreVendedor || "seleccionado"}"?
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