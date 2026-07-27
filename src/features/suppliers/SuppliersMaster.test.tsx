import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SuppliersMaster from "./SuppliersMaster";
import { ITercero } from "@/types/ITercero";

vi.mock("@/services/TipoDocumentoIdentidadService", () => ({
    TipoDocumentoIdentidadService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/MunicipioService", () => ({
    MunicipioService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/DepartamentoService", () => ({
    DepartamentoService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/ResponsabilidadFiscalService", () => ({
    ResponsabilidadFiscalService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/TipoRegimenService", () => ({
    TipoRegimenService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/ListaPrecioService", () => ({
    ListaPrecioService: { getAll: vi.fn().mockResolvedValue([]) },
}));
vi.mock("@/services/TerceroService", () => ({
    TerceroService: {
        getAll: vi.fn().mockResolvedValue([]),
        create: vi.fn(),
        update: vi.fn(),
        search: vi.fn(),
    },
}));

import { TerceroService } from "@/services/TerceroService";

const terceroExistente = {
    idTercero: 259023,
    idTipoDocumentoId: 4,
    digitoVerificacion: "5",
    numeroIdentificacion: "1018511502",
    primerNombre: "Jhonn",
    segundoNombre: null,
    primerApellido: "Merchan",
    segundoApellido: null,
    razonSocial: "Jhonn Merchan",
    telefonoTercero: "3028551912",
    direccionTercero: "Transversal 4b # 58 a 30",
    idMunicipio: 3522,
    nombreMunicipio: "BOGOTA DC",
    emailTercero: "jhonn24merchan@gmail.com",
    idDepartamento: 4,
    nombreDepartamento: "Bogotá",
    terceroActivo: true,
    terceroCliente: true,
    terceroProveedor: false,
    terceroEmpleado: false,
    terceroGeneral: true,
    idTipoRegimen: 2,
    idListaPreciosTercero: 1,
    responsabilidadesTerceros: [],
} as unknown as ITercero;

function renderSuppliersMaster() {
    return render(
        <MemoryRouter>
            <SuppliersMaster />
        </MemoryRouter>
    );
}

describe("SuppliersMaster - validación de tercero existente al crear", () => {
    it("no cambia de modo si el número de identificación no existe", async () => {
        vi.mocked(TerceroService.search).mockResolvedValue([]);
        renderSuppliersMaster();

        const user = userEvent.setup();
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "999999999");
        await user.tab();

        expect(TerceroService.search).toHaveBeenCalledWith("999999999");
        expect(screen.getByPlaceholderText("Primer nombre")).toHaveValue("");
        expect(screen.getByPlaceholderText("Razón social")).toHaveValue("");
    });

    it("autocompleta y pasa a modo edición si el número de identificación ya existe", async () => {
        vi.mocked(TerceroService.search).mockResolvedValue([terceroExistente]);
        renderSuppliersMaster();

        const user = userEvent.setup();
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "1018511502");
        await user.tab();

        expect(await screen.findByPlaceholderText("Primer nombre")).toHaveValue("Jhonn");
        expect(screen.getByPlaceholderText("Razón social")).toHaveValue("Jhonn Merchan");

        await user.click(screen.getByTitle("Guardar tercero"));
        expect(TerceroService.update).toHaveBeenCalled();
        expect(TerceroService.create).not.toHaveBeenCalled();
    });

    it("vuelve a modo creación si el número cambia a uno que no existe", async () => {
        vi.mocked(TerceroService.search)
            .mockResolvedValueOnce([terceroExistente])
            .mockResolvedValueOnce([]);
        renderSuppliersMaster();

        const user = userEvent.setup();
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "1018511502");
        await user.tab();
        expect(await screen.findByPlaceholderText("Primer nombre")).toHaveValue("Jhonn");

        await user.clear(inputIdentificacion);
        await user.type(inputIdentificacion, "888888888");
        await user.tab();

        expect(await screen.findByPlaceholderText("Primer nombre")).toHaveValue("");
        expect(screen.getByPlaceholderText("Número de identificación")).toHaveValue("888888888");
    });

    it("no bloquea el formulario si la validación falla por error de red", async () => {
        vi.mocked(TerceroService.search).mockRejectedValue(new Error("network error"));
        renderSuppliersMaster();

        const user = userEvent.setup();
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "999999999");
        await user.tab();

        const inputPrimerNombre = screen.getByPlaceholderText("Primer nombre");
        await user.type(inputPrimerNombre, "Prueba");
        expect(inputPrimerNombre).toHaveValue("Prueba");
    });
});
