import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ItemsMaster from "./ItemsMaster";
import { IProducto } from "@/types/IProducto";

vi.mock("@/services/CategoryService", () => ({
    CategoryService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/UnidadDeMedidaService", () => ({
    UnidadDeMedidaService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/TipoProductoService", () => ({
    TipoProductoService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/TributoService", () => ({
    TributoService: {
        getAll: vi.fn().mockResolvedValue([]),
        getTarifasPorTributo: vi.fn().mockResolvedValue([]),
    },
}));
vi.mock("@/services/TerceroService", () => ({
    TerceroService: { getTercerosProveedores: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/ListaPrecioService", () => ({
    ListaPrecioService: {
        getAll: vi.fn().mockResolvedValue([
            { idListaPrecio: 1, codigoListaPrecio: "L01", nombreListaPrecio: "Lista Mayorista" },
        ]),
    },
}));

const productoConDatos = {
    idProducto: 1,
    codigoProducto: "P001",
    nombreProducto: "Producto Uno",
    imagenProducto: null,
    codigoBarras: null,
    idCategoria: 6,
    idUnidadMedida: 1,
    precioUnitario: 1000,
    precioPos: 0,
    porcentajeIva: 19,
    porcentajeImpoConsumo: 0,
    porcentajeReteIva: 0,
    porcentajeReteRenta: 0,
    porcentajeReteIca: 0,
    porcentajeMaxDescuento: 15,
    quantity: 0,
    idTipoProducto: 1,
    productoActivo: true,
    codigoItemSector: false,
    idTerceroMandato: null,
    tributosProducto: [
        {
            idTributoProducto: 39,
            idTributo: "1",
            codigoTributo: "01",
            nombreTributo: "IVA",
            idTarifaProducto: null,
            codigoTarifa: "01-000",
            nombreTarifa: "Tarifa General 19%",
            tarifa: 19,
        },
    ],
    // Forma real que devuelve el backend: sin codigoListaPrecio/nombreListaPrecio.
    preciosProducto: [{ idPrecioProducto: 1, idListaPrecio: 1, precio: 3650 }],
} as unknown as IProducto;

const productoSinDatos = {
    ...productoConDatos,
    idProducto: 2,
    codigoProducto: "P002",
    nombreProducto: "Producto Dos",
    porcentajeMaxDescuento: 0,
    tributosProducto: [],
    preciosProducto: [],
} as unknown as IProducto;

vi.mock("@/services/ProductoService", () => ({
    ProductoService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
}));

import { ProductoService } from "@/services/ProductoService";

function renderItemsMaster() {
    return render(
        <MemoryRouter>
            <ItemsMaster />
        </MemoryRouter>
    );
}

async function seleccionarProducto(nombreProducto: string) {
    const user = userEvent.setup();
    await user.click(await screen.findByTitle("Buscar producto"));
    await user.click(await screen.findByText(nombreProducto));
}

describe("ItemsMaster - selección de producto por búsqueda", () => {
    it("pobla % Máx. Descuento, Impuestos y Precios del producto seleccionado", async () => {
        vi.mocked(ProductoService.getAll).mockResolvedValue([productoConDatos]);
        renderItemsMaster();

        await seleccionarProducto("Producto Uno");

        expect(screen.getByPlaceholderText("Porcentaje máximo descuento")).toHaveValue(15);

        const tablaImpuestos = screen.getByText("IVA").closest("table") as HTMLElement;
        expect(within(tablaImpuestos).getByText("01")).toBeInTheDocument();
        expect(within(tablaImpuestos).getByText("Tarifa General 19%")).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByRole("tab", { name: "Precios" }));

        expect(await screen.findByText("L01")).toBeInTheDocument();
        expect(screen.getByText("$Lista Mayorista")).toBeInTheDocument();
        expect(screen.getByText("3650")).toBeInTheDocument();
    });

    it("deja las tablas vacías al seleccionar un producto sin impuestos ni precios", async () => {
        vi.mocked(ProductoService.getAll).mockResolvedValue([productoSinDatos]);
        renderItemsMaster();

        await seleccionarProducto("Producto Dos");

        expect(screen.getByPlaceholderText("Porcentaje máximo descuento")).toHaveValue(0);
        expect(screen.queryByText("IVA")).not.toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByRole("tab", { name: "Precios" }));
        expect(screen.queryByText("Lista Mayorista", { exact: false })).not.toBeInTheDocument();
    });
});
