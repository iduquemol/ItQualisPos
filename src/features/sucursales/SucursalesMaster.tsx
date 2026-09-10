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
import { Check, CircleX, Pencil, Search, X, Save, Trash, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ISucursales } from "@/types/ISucursales";
import { SucursalService } from "@/services/SucursalService";
import { IDepartamento } from "@/types/IDepartamento";
import { IMunicipiosPorDepartamento } from "@/types/IMunicipio";
import { DepartamentoService } from "@/services/DepartamentoService";
import { MunicipioService } from "@/services/MunicipioService";
import { TerceroService } from "@/services/TerceroService";
import { ITercero } from "@/types/ITercero";

export default function SucursalesMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [sucursal, setSucursal] = useState<ISucursales>({
    idSucursal: 0,
    codigoSucursal: "",
    nombreSucursal: "",
    idDepartamentoSucursal: null,
    idMunicipioSucursal: null,
    direccionSucursal: "",
    telefonoSucursal: "",
    idTerceroResponsableSucursal: null,
    notaFeSucursal: "",
    fechaGrabacionSucursal: null,
  });
        
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sucursalesList, setSucursalesList] = useState<ISucursales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);
  const [departamentoError, setDepartamentoError] = useState<string | null>(null);
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState<IMunicipiosPorDepartamento[]>([]);
  const [municipioError, setMunicipioError] = useState<string | null>(null);
  const [openTerceroDialog, setOpenTerceroDialog] = useState(false);
  const [searchTercero, setSearchTercero] = useState("");
  const [terceros, setTerceros] = useState<ITercero[]>([]);
  const [isLoadingTerceros, setIsLoadingTerceros] = useState(false);
  const [terceroError, setTerceroError] = useState<string | null>(null);
  const [nombreTerceroResponsable, setNombreTerceroResponsable] = useState("");

  const fetchSucursales = async () => {
    try {
      setIsLoading(true);
      const data = await SucursalService.getAll();
      setSucursalesList(data);
    } catch (error) {
      toast.error("Error al cargar sucursales");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        const [departamentosData, municipiosData] = await Promise.all([
          DepartamentoService.getAll(),
          MunicipioService.getAll(),
        ]);

        setDepartamentos(departamentosData);
        setMunicipiosPorDepartamento(municipiosData);
        setDepartamentoError(null);
        setMunicipioError(null);
      } catch (error) {
        setDepartamentoError("Error al cargar los departamentos");
        setMunicipioError("Error al cargar los municipios");
        toast.error("Error al cargar la información de ubicación");
      }
    };

    loadCatalogos();
  }, []);

  const handleSelectSucursal = (cat: ISucursales) => {
    setSucursal(cat);
    setNombreTerceroResponsable("");
    setOpenDialog(false);
  };

  const handleNew = () => {
    setSucursal({
      idSucursal: 0,
      codigoSucursal: "",
      nombreSucursal: "",
      idDepartamentoSucursal: null,
      idMunicipioSucursal: null,
      direccionSucursal: "",
      telefonoSucursal: "",
      idTerceroResponsableSucursal: null,
      notaFeSucursal: "",
      fechaGrabacionSucursal: null,
    });
    setNombreTerceroResponsable("");
    setFormError(null);
  };

  const loadTerceros = async (query = "") => {
    setIsLoadingTerceros(true);
    setTerceroError(null);

    try {
      setTerceros(await TerceroService.search(query.trim()));
    } catch (error) {
      setTerceroError("Error al buscar terceros");
      setTerceros([]);
    } finally {
      setIsLoadingTerceros(false);
    }
  };

  const handleSelectTercero = (tercero: ITercero) => {
    setSucursal((prev) => ({
      ...prev,
      idTerceroResponsableSucursal: tercero.idTercero ?? null,
    }));
    setNombreTerceroResponsable(getNombreTercero(tercero));
    setOpenTerceroDialog(false);
    setSearchTercero("");
    setTerceros([]);
  };

  const getNombreTercero = (tercero: ITercero) =>
    tercero.razonSocial?.trim() ||
    [tercero.primerNombre, tercero.segundoNombre, tercero.primerApellido, tercero.segundoApellido]
      .filter(Boolean)
      .join(" ")
      .trim();

   const handleMunicipioChange = (idMunicipioSeleccionado: number) => {
        setSucursal((prev) => ({
            ...prev,
            idMunicipioSucursal: idMunicipioSeleccionado,
        }));

    };

  const handleSave = async () => {
    if (!sucursal.codigoSucursal?.trim()) {
      setFormError("El código de la sucursal es obligatorio.");
      return;
    }
    if (!sucursal.nombreSucursal?.trim()) {
      setFormError("El nombre de la sucursal es obligatorio.");
      return;
    }
    if (!sucursal.idDepartamentoSucursal || sucursal.idDepartamentoSucursal === 0) {
      setFormError("El departamento es obligatorio.");
      return;
    }
    if (!sucursal.idMunicipioSucursal || sucursal.idMunicipioSucursal === 0) {
      setFormError("El municipio es obligatorio.");
      return;
    }
    if (!sucursal.telefonoSucursal?.trim()) {
      setFormError("El teléfono es obligatorio.");
      return;
    }

    setFormError(null);

    try {
      if (sucursal.idSucursal) {
        await SucursalService.update(sucursal);
        setSuccessMessage("Sucursal actualizada correctamente.");
      } else {
        await SucursalService.create(sucursal);
        setSuccessMessage("Sucursal guardada correctamente.");
      }
      setShowSuccessDialog(true);
      fetchSucursales();
    } catch (error) {
      toast.error("Error al guardar la sucursal");
    }
  };

  const handleDelete = () => {
    if (!sucursal.idSucursal) {
      toast.error("No hay una sucursal seleccionada para eliminar");
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (sucursal.idSucursal) {
        await SucursalService.delete(sucursal.idSucursal);
        toast.success("Sucursal eliminada correctamente");
        handleNew();
        fetchSucursales();
      }
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Error al eliminar la sucursal");
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
          <h2 className="text-2xl font-bold">Maestro de Sucursales</h2>
          <p className="text-muted-foreground text-sm">
            Gestión de sucursales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="icon" title="Nueva sucursal" onClick={handleNew}>
            <Plus className="w-5 h-5" />
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar sucursal">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Sucursal</DialogTitle>
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
                    {sucursalesList
                      .filter(
                        (c) =>
                          c.codigoSucursal?.toLowerCase().includes(search.toLowerCase()) ||
                          c.nombreSucursal?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((c) => (
                        <TableRow
                          key={c.idSucursal}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectSucursal(c)}
                        >
                          <TableCell>{c.codigoSucursal}</TableCell>
                          <TableCell>{c.nombreSucursal}</TableCell>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
              <label className="block text-xs text-muted-foreground mb-1">
                  Código Sucursal (*)
              </label>
              <Input
                  value={sucursal.codigoSucursal ?? ""}
                  onChange={(e) =>
                  setSucursal({ ...sucursal, codigoSucursal: e.target.value })
                  }
                  placeholder="Código de la sucursal"
              />
              </div>
            
              <div>
              <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Sucursal (*)
              </label>
              <Input
                  value={sucursal.nombreSucursal ?? ""}
                  onChange={(e) =>
                  setSucursal({ ...sucursal, nombreSucursal: e.target.value })
                  }
                  placeholder="Nombre de la sucursal"
              />
              </div>
                                         
                <div>
                    <label className="block text-xs text-muted-foreground mb-1">Departamento</label>
                    <select
                        className={
                            (!sucursal.idDepartamentoSucursal || sucursal.idDepartamentoSucursal === 0) && formError
                                ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                : "w-full rounded border px-3 py-2 text-sm bg-background"
                        }
                        value={sucursal.idDepartamentoSucursal ?? 0}
                        onChange={e => {
                            const newDepartamentoId = Number(e.target.value);
                            setSucursal({
                                ...sucursal,
                                idDepartamentoSucursal: newDepartamentoId,
                                idMunicipioSucursal: 0,
                            });
                            setFormError(null);
                        }}
                        required
                    >
                        <option value={0}>Seleccione un departamento</option>
                        {departamentos.map(dep => (
                            <option key={dep.idDepartamento} value={dep.idDepartamento}>
                                {dep.nombreDepartamento}
                            </option>
                        ))}
                    </select>
                    {formError && (!sucursal.idDepartamentoSucursal || sucursal.idDepartamentoSucursal === 0) && (
                        <span className="text-xs text-red-500">El departamento es obligatorio.</span>
                    )}
                    {departamentoError && (
                        <span className="text-xs text-red-500">{departamentoError}</span>
                    )}
                </div>
                <div>
                    <label className="block text-xs text-muted-foreground mb-1">Municipio</label>
                    <select
                        className={
                            (!sucursal.idMunicipioSucursal || sucursal.idMunicipioSucursal === 0) && formError
                                ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                : "w-full rounded border px-3 py-2 text-sm bg-background"
                        }
                        value={sucursal.idMunicipioSucursal ?? 0}
                        onChange={e => handleMunicipioChange(Number(e.target.value))}
                        required
                    >
                        <option value={0}>Seleccione un municipio</option>
                        {municipiosPorDepartamento
                            .find((dep: IMunicipiosPorDepartamento) => dep.idDepartamento === sucursal.idDepartamentoSucursal)
                            ?.municipios.map((mun) => (
                                <option key={mun.idMunicipio} value={mun.idMunicipio}>
                                    {mun.nombreMunicipio}
                                </option>
                            ))}
                    </select>
                    {formError && (!sucursal.idMunicipioSucursal || sucursal.idMunicipioSucursal === 0) && (
                        <span className="text-xs text-red-500">El municipio es obligatorio.</span>
                    )}
                    {municipioError && (
                        <span className="text-xs text-red-500">{municipioError}</span>
                    )}
                </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Dirección</label>
                    <Input
                      value={sucursal.direccionSucursal ?? ""}
                      onChange={e => setSucursal({ ...sucursal, direccionSucursal: e.target.value })}
                      placeholder="Dirección de la sucursal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Teléfono</label>
                    <Input
                      type="text"
                      value={sucursal.telefonoSucursal ?? ""}
                      onChange={e => {
                        const digitos = e.target.value.replace(/\D/g, "");
                        const digitosLimitados = digitos.slice(0, 10);
                        let formatoTelefono = digitosLimitados;
                        if (digitosLimitados.length > 3 && digitosLimitados.length <= 6) {
                          formatoTelefono = `${digitosLimitados.slice(0, 3)} ${digitosLimitados.slice(3)}`;
                        } else if (digitosLimitados.length > 6) {
                          formatoTelefono = `${digitosLimitados.slice(0, 3)} ${digitosLimitados.slice(3, 6)} ${digitosLimitados.slice(6)}`;
                        }
                        setSucursal({ ...sucursal, telefonoSucursal: formatoTelefono });
                        setFormError(null);
                      }}
                      placeholder="Ej: 300 123 4567"
                      required
                      className={!sucursal.telefonoSucursal?.trim() && formError ? "border border-red-500" : ""}
                    />
                    {formError && !sucursal.telefonoSucursal?.trim() && (
                      <span className="text-xs text-red-500">El teléfono es obligatorio.</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Tercero responsable</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={nombreTerceroResponsable}
                        placeholder="Seleccione un tercero responsable"
                        readOnly
                      />
                      <Dialog open={openTerceroDialog} onOpenChange={(isOpen) => {
                        setOpenTerceroDialog(isOpen);
                        if (isOpen) {
                          setSearchTercero("");
                          void loadTerceros("");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" title="Buscar tercero responsable" type="button">
                            <Search className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Buscar Tercero Responsable</DialogTitle>
                          </DialogHeader>
                          <Input
                            className="mb-4"
                            placeholder="Buscar por identificación o nombre..."
                            value={searchTercero}
                            onChange={e => {
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
                                  <TableHead>Nombre</TableHead>
                                  <TableHead>Razón Social</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {terceros.map(tercero => (
                                  <TableRow
                                    key={tercero.idTercero ?? tercero.numeroIdentificacion}
                                    className="cursor-pointer hover:bg-primary/10"
                                    onClick={() => handleSelectTercero(tercero)}
                                  >
                                    <TableCell>{tercero.numeroIdentificacion}</TableCell>
                                    <TableCell>{[tercero.primerNombre, tercero.primerApellido].filter(Boolean).join(" ")}</TableCell>
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
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">Nota FE</label>
                    <Input
                      value={sucursal.notaFeSucursal ?? ""}
                      onChange={e => setSucursal({ ...sucursal, notaFeSucursal: e.target.value })}
                      placeholder="Nota de facturación electrónica"
                    />
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
              ¿Está seguro que desea eliminar la sucursal "{sucursal.nombreSucursal || "seleccionada"}"?
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