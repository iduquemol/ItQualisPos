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
import { ICategorias } from "@/types/ICategorias";
import { CATEGORY_ICONS } from "@/types/ICategoryIcons";
import { CategoriasService } from "@/services/CategoryService";
import { TributoService } from '@/services/TributoService';
import { ITarifasPorTributo } from '@/types/ITarifasPorTributo';
import { ITributo } from '@/types/ITributo';
import { ITributoCategoria } from '@/types/ITributoCategoria';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CategoriesMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [categoria, setCategoria] = useState<ICategorias>({
    idCategoria: null,
    codigoCategoria: "",
    nombreCategoria: "",
    iconoCategoria: "",
    categoriaActiva: true,
    tributosCategoria: [],
  });
  const selectedCategoryIcon = CATEGORY_ICONS.find(
    (categoryIcon) => categoryIcon.id === categoria.iconoCategoria
  );
  const SelectedCategoryIcon = selectedCategoryIcon?.icon;

  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoriasList, setCategoriasList] = useState<ICategorias[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      const data = await CategoriasService.getAll();
      setCategoriasList(data);
    } catch (error) {
      toast.error("Error al cargar categorías");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSelectCategoria = (cat: ICategorias) => {
    setCategoria(cat);
    setOpenDialog(false);
  };

  const handleNew = () => {
    setCategoria({
      idCategoria: null,
      codigoCategoria: "",
      nombreCategoria: "",
      iconoCategoria: "",
      categoriaActiva: true,
      tributosCategoria: [],
    });
    setFormError(null);
  };

  const handleSave = async () => {
    if (!categoria.codigoCategoria?.trim()) {
      setFormError("El código de la categoría es obligatorio.");
      return;
    }
    if (!categoria.nombreCategoria?.trim()) {
      setFormError("El nombre de la categoría es obligatorio.");
      return;
    }

    setFormError(null);

    try {
      if (categoria.idCategoria) {
        await CategoriasService.update(categoria);
        setSuccessMessage("Categoría actualizada correctamente.");
      } else {
        await CategoriasService.create(categoria);
        setSuccessMessage("Categoría guardada correctamente.");
      }
      setShowSuccessDialog(true);
      fetchCategorias();
    } catch (error) {
      toast.error("Error al guardar la categoría");
    }
  };

  const handleDelete = () => {
    if (!categoria.idCategoria) {
      toast.error("No hay una categoría seleccionada para eliminar");
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (categoria.idCategoria) {
        await CategoriasService.delete(categoria.idCategoria);
        toast.success("Categoría eliminada correctamente");
        handleNew();
        fetchCategorias();
      }
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Error al eliminar la categoría");
      setShowDeleteDialog(false);
    }
  };

  const [tributos, setTributos] = useState<ITributo[]>([]);
  const [tarifas, setTarifas] = useState<ITarifasPorTributo[]>([]);
  const [editImpuestoIdx, setEditImpuestoIdx] = useState<number | null>(null);
  const [editImpuesto, setEditImpuesto] = useState<ITributoCategoria | null>(null);
  const [addImpuestoMode, setAddImpuestoMode] = useState(false);
  const impuestoInicial = (): ITributoCategoria => ({
    idTributoCategoria: null, idCategoria: categoria.idCategoria || null,
    idTributo: 0, idTarifaTributo: 0,
  });
  const [nuevoImpuesto, setNuevoImpuesto] = useState<ITributoCategoria>(impuestoInicial());

  const getImpuestosDisponibles = (excludeIdx?: number, currentId?: number) => {
    const usados = (categoria.tributosCategoria || [])
      .filter((_, index) => index !== excludeIdx)
      .map((item) => item.idTributo);
    return tributos.filter((tributo) =>
      tributo.idTributo !== 0 && (tributo.idTributo === currentId || !usados.includes(tributo.idTributo))
    );
  };

  const seleccionarImpuesto = (value: string, impuesto: ITributoCategoria) => {
    const numericValue = Number(value);
    const tributo = tributos.find((item) => item.idTributo === numericValue);
    
    return {
      ...impuesto, 
      idTributo: tributo ? tributo.idTributo : 0, 
      idTarifaTributo: 0, // Reiniciamos la tarifa al cambiar de tributo
    };
  };

  const seleccionarTarifa = (value: string, impuesto: ITributoCategoria) => {
    const numericValue = Number(value);
    const tarifaGroup = tarifas.find((item) => item.idTributo === impuesto.idTributo);
    const tarifa = tarifaGroup?.tarifasTributo.find((item) => item.idTarifaTributo === numericValue);

    return {
      ...impuesto, 
      idTarifaTributo: tarifa ? tarifa.idTarifaTributo : 0,
    };
  };

  // Al seleccionar o agregar el impuesto al array
  const handleAddImpuesto = () => {
    if (!nuevoImpuesto.idTributo || !nuevoImpuesto.idTarifaTributo) {
      toast.error("Seleccione un impuesto y una tarifa");
      return;
    }

    // Buscar el objeto tributo real para obtener su idTributo numérico
    const tributoEncontrado = tributos.find(
      (t) => t.idTributo === Number(nuevoImpuesto.idTributo) || t.codigoTributo === String(nuevoImpuesto.idTributo)
    );

    const tributoAInsertar = {
      idTributoCategoria: null,
      idCategoria: categoria.idCategoria || null,
      idTributo: tributoEncontrado ? Number(tributoEncontrado.idTributo) : Number(nuevoImpuesto.idTributo),
      idTarifaTributo: Number(nuevoImpuesto.idTarifaTributo),
      // Opcionales para renderizar en la tabla
      codigoTributo: tributoEncontrado?.codigoTributo || "",
      nombreTributo: tributoEncontrado?.nombreTributo || "",
    };

    setCategoria((prev) => ({
      ...prev,
      tributosCategoria: [...(prev.tributosCategoria || []), tributoAInsertar],
    }));

    setNuevoImpuesto(impuestoInicial());
    setAddImpuestoMode(false);
  };

  const handleSaveImpuesto = () => {
    if (editImpuestoIdx === null || !editImpuesto || !editImpuesto.idTarifaTributo) {
      toast.error("Seleccione una tarifa");
      return;
    }
    const tributosCategoria = [...(categoria.tributosCategoria || [])];
    tributosCategoria[editImpuestoIdx] = editImpuesto;
    setCategoria({ ...categoria, tributosCategoria });
    setEditImpuestoIdx(null);
    setEditImpuesto(null);
  };

  const handleDeleteImpuesto = (idx: number) => {
    setCategoria({ ...categoria, tributosCategoria: (categoria.tributosCategoria || []).filter((_, index) => index !== idx) });
  };

    const fetchTarifas = async () => {
    try {
        const data = await TributoService.getTarifasPorTributo();
        setTarifas(data);
    } catch (error) {
        console.error("Error al cargar tarifas de tributo:", error);
    }
    };

    useEffect(() => {
    fetchCategorias();
    fetchTarifas();
    TributoService.getAll().then(setTributos).catch(() => toast.error("Error al cargar impuestos"));
    }, []);

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
          <h2 className="text-2xl font-bold">Maestro de Categorías</h2>
          <p className="text-muted-foreground text-sm">
            Gestión de categorías e impuestos asociados a productos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="icon" title="Nueva categoría" onClick={handleNew}>
            <Plus className="w-5 h-5" />
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar categoría">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar Categoría</DialogTitle>
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
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoriasList
                      .filter(
                        (c) =>
                          c.codigoCategoria?.toLowerCase().includes(search.toLowerCase()) ||
                          c.nombreCategoria?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((c) => (
                        <TableRow
                          key={c.idCategoria}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectCategoria(c)}
                        >
                          <TableCell>{c.codigoCategoria}</TableCell>
                          <TableCell>{c.nombreCategoria}</TableCell>
                          <TableCell>{c.categoriaActiva ? "Activa" : "Inactiva"}</TableCell>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
              <label className="block text-xs text-muted-foreground mb-1">
                  Código Categoría (*)
              </label>
              <Input
                  value={categoria.codigoCategoria ?? ""}
                  onChange={(e) =>
                  setCategoria({ ...categoria, codigoCategoria: e.target.value })
                  }
                  placeholder="Código de la categoría"
                  required
              />
              </div>
            
              <div>
              <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Categoría (*)
              </label>
              <Input
                  value={categoria.nombreCategoria ?? ""}
                  onChange={(e) =>
                  setCategoria({ ...categoria, nombreCategoria: e.target.value })
                  }
                  placeholder="Nombre de la categoría"
                  required
              />
              </div>
              
              <div>
              <label className="block text-xs text-muted-foreground mb-1">
                  Ícono Categoría
              </label>
              <Select
                  value={categoria.iconoCategoria ?? ""}
                onValueChange={(value) =>
                setCategoria({ ...categoria, iconoCategoria: value })
                }
              >
                <SelectTrigger className="w-full">
                                    
                  <SelectValue placeholder="Seleccione un ícono" />
                
                </SelectTrigger>
                <SelectContent>
                {CATEGORY_ICONS.map(({ id, label, icon: CategoryIcon }) => (
                  <SelectItem key={id} value={id}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              </div>
              
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Estado Categoría</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    checked={categoria.categoriaActiva || false}
                    onChange={(e) =>
                      setCategoria({ ...categoria, categoriaActiva: e.target.checked })
                    }
                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    {categoria.categoriaActiva ? "Categoría activa" : "Categoría inactiva"}
                  </span>
                </div>
              </div>
          </div>
        </Card>
        
        <fieldset
          disabled={!categoria.codigoCategoria?.trim()}
          className={!categoria.codigoCategoria?.trim() ? "opacity-50" : ""}
        >
        <Card className="overflow-x-auto border-2 border-border bg-muted/40 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-2 text-left font-semibold w-64">Código Impuesto</th>
                <th className="px-4 py-2 text-left font-semibold w-96">Nombre Impuesto</th>
                <th className="px-4 py-2 text-left font-semibold w-96">Tarifa</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {(categoria.tributosCategoria || []).map((item, idx) => {
                const tributo = tributos.find((value) => value.idTributo === item.idTributo);
                const tarifa = tarifas
                  .find((value) => value.idTributo === item.idTributo)
                  ?.tarifasTributo.find((value) => value.idTarifaTributo === item.idTarifaTributo);
                const editing = editImpuestoIdx === idx && editImpuesto;
                return (
                  <tr key={item.idTributoCategoria ?? `${item.idTributo}-${idx}`} className="border-b">
                    {editing ? (
                      <>
                        <td className="px-4 py-2">
                          <select
                            className="w-full rounded border px-2 py-1"
                            value={String(editImpuesto.idTributo)}
                            onChange={(event) => setEditImpuesto(seleccionarImpuesto(event.target.value, editImpuesto))}
                          >
                            <option value="0">Seleccione el impuesto...</option>
                            {getImpuestosDisponibles(idx, editImpuesto.idTributo).map((value) => (
                              <option key={value.idTributo} value={value.idTributo}>{value.codigoTributo}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            className="w-full rounded border px-2 py-1 bg-background"
                            value={tributos.find((value) => value.idTributo === editImpuesto.idTributo)?.nombreTributo || ""}
                            placeholder="Nombre"
                            disabled
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            className="w-full rounded border px-2 py-1"
                            value={String(editImpuesto.idTarifaTributo || "")}
                            onChange={(event) => setEditImpuesto(seleccionarTarifa(event.target.value, editImpuesto))}
                          >
                            <option value="">Seleccione una tarifa...</option>
                            {tarifas.find((value) => value.idTributo === editImpuesto.idTributo)?.tarifasTributo.map((value) => (
                              <option key={value.idTarifaTributo} value={value.idTarifaTributo}>{value.nombreTarifa}</option>
                            ))}
                          </select>
                        </td>
                        <td className="flex gap-2 px-4 py-2">
                          <button title="Guardar" onClick={handleSaveImpuesto}><Check className="h-5 w-5 text-green-600" /></button>
                          <button title="Cancelar" onClick={() => { setEditImpuestoIdx(null); setEditImpuesto(null); }}><CircleX className="h-5 w-5 text-red-600" /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{tributo?.codigoTributo || item.idTributo}</td>
                        <td className="px-4 py-2">{tributo?.nombreTributo || ""}</td>
                        <td className="px-4 py-2">{tarifa?.nombreTarifa || item.idTarifaTributo}</td>
                        <td className="flex gap-2 px-4 py-2">
                          <button title="Editar" onClick={() => { setEditImpuestoIdx(idx); setEditImpuesto({ ...item }); }}><Pencil className="h-4 w-4 text-blue-600" /></button>
                          <button title="Eliminar" onClick={() => handleDeleteImpuesto(idx)}><Trash className="h-4 w-4 text-red-600" /></button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {addImpuestoMode && (
                <tr className="border-b bg-accent/40">
                  <td className="px-4 py-2">
                    <select
                      className="w-full rounded border px-2 py-1"
                      value={String(nuevoImpuesto.idTributo)}
                      onChange={(event) => setNuevoImpuesto(seleccionarImpuesto(event.target.value, nuevoImpuesto))}
                    >
                      <option value="0">Seleccione el impuesto...</option>
                      {getImpuestosDisponibles()
                        .filter(t => t.idTributo !== 0)
                        .map(t => (
                          <option key={t.idTributo} value={t.idTributo}>
                                {t.nombreTributo} ({t.codigoTributo})
                            </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className="w-full rounded border px-2 py-1 bg-background"
                      value={tributos.find((value) => value.idTributo === nuevoImpuesto.idTributo)?.nombreTributo || ""}
                      placeholder="Nombre"
                      disabled
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="w-full rounded border px-2 py-1"
                      value={String(nuevoImpuesto.idTarifaTributo || "")}
                      onChange={(event) => setNuevoImpuesto(seleccionarTarifa(event.target.value, nuevoImpuesto))}
                    >
                      <option value="">Seleccione una tarifa...</option>
                      {tarifas.find((value) => value.idTributo === nuevoImpuesto.idTributo)?.tarifasTributo.map((value) => (
                        <option key={value.idTarifaTributo} value={value.idTarifaTributo}>{value.nombreTarifa}</option>
                      ))}
                    </select>
                  </td>
                  <td className="flex gap-2 px-4 py-2">
                    <button title="Guardar" onClick={handleAddImpuesto}><Check className="h-5 w-5 text-green-600" /></button>
                    <button title="Cancelar" onClick={() => { setAddImpuestoMode(false); setNuevoImpuesto(impuestoInicial()); }}><CircleX className="h-5 w-5 text-red-600" /></button>
                  </td>
                </tr>
              )}
                {!addImpuestoMode && (
                  <tr>
                    <td colSpan={4} className="px-0 py-2">
                      <button
                        className="bg-black text-white font-semibold px-4 py-2 rounded text-left"
                        onClick={() => setAddImpuestoMode(true)}
                      >
                        + Agregar impuesto
                      </button>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </Card>
        </fieldset>
        
      

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
              ¿Está seguro que desea eliminar la categoría "{categoria.nombreCategoria}"?
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