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
import { ICategorias } from "@/types/ICategorias";
import { CategoriasService } from "@/services/CategoryService";
import { TributoService } from '@/services/TributoService';
import { ITarifasPorTributo } from '@/types/ITarifasPorTributo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CategoriesMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [categoria, setCategoria] = useState<ICategorias>({
    idCategoria: null,
    codigoCategoria: "",
    nombreCategoria: "",
    iconoCategoria: "",
    idTarifaTributo: null,
  });

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
      idTarifaTributo: null,
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

  const [tarifas, setTarifas] = useState<ITarifasPorTributo[]>([]);

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
                      <TableHead>Tarifa Impuesto</TableHead>
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
                          <TableCell>{c.nombreTarifa ?? "N/A"}</TableCell>
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
      <Tabs defaultValue="general" className="w-full">
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Código */}
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
                />
                </div>

                {/* 2. Nombre */}
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
                />
                </div>

                {/* 3. Ícono */}
                <div>
                <label className="block text-xs text-muted-foreground mb-1">
                    Ícono Categoría
                </label>
                <Input
                    value={categoria.iconoCategoria ?? ""}
                    onChange={(e) =>
                    setCategoria({ ...categoria, iconoCategoria: e.target.value })
                    }
                    placeholder="Nombre de ícono o clase"
                />
                </div>

                {/* 4. Impuesto por Defecto (NUEVO) */}
                <div>
                <label className="block text-xs text-muted-foreground mb-1">
                    Impuesto por Defecto
                </label>
                <Select
                    value={categoria.idTarifaTributo?.toString() ?? ""}
                    onValueChange={(val) =>
                    setCategoria({ ...categoria, idTarifaTributo: val ? Number(val) : null })
                    }
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Seleccione un impuesto" />
                    </SelectTrigger>
                    <SelectContent>
                    {tarifas.flatMap((tributo) =>
                      (tributo.tarifasTributo ?? []).map((t) => (
                        <SelectItem
                          key={`${tributo.idTributo}-${t.idTarifaTributo}`}
                          value={t.idTarifaTributo.toString()}
                        >
                          {tributo.nombreTributo} / {t.nombreTarifa} ({t.tarifaTributo}%)
                        </SelectItem>
                      ))
                    )}
                    </SelectContent>
                </Select>
                </div>
            </div>
            </Card>
        </TabsContent>
      </Tabs>

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