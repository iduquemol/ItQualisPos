import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SuppliersMaster from "./SuppliersMaster";
import { ITercero } from "@/types/ITercero";

vi.mock("@/services/TipoDocumentoIdentidadService", () => ({
    TipoDocumentoIdentidadService: {
        getAll: vi.fn().mockResolvedValue([
            { idTipoDocumentoId: 4, codigoTipoDocumentoId: "13", nombreTipoDocumentoId: "Cédula de ciudadanía", observacionTipoDocumentoId: null },
        ]),
    },
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
        consultarDatosExternos: vi.fn(),
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

function selectByLabel(labelText: string): HTMLSelectElement {
    const label = screen.getByText(labelText);
    return label.parentElement!.querySelector("select") as HTMLSelectElement;
}

async function selectTipoDocumento(value: string) {
    const select = selectByLabel("Tipo de Documento");
    await waitFor(() => expect(select.options.length).toBeGreaterThan(0));
    await userEvent.setup().selectOptions(select, value);
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

describe("SuppliersMaster - consulta de datos en API externa", () => {
    it("autocompleta razón social y correo cuando el número no existe localmente", async () => {
        vi.mocked(TerceroService.search).mockResolvedValue([]);
        vi.mocked(TerceroService.consultarDatosExternos).mockResolvedValue({
            message: null,
            email: "astridiazc@gmail.com",
            name: "DIAZ CAMACHO ASTRID",
        });
        renderSuppliersMaster();

        const user = userEvent.setup();
        await selectTipoDocumento("4");
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "52082117");
        await user.tab();

        expect(await screen.findByPlaceholderText("Razón social")).toHaveValue("DIAZ CAMACHO ASTRID");
        expect(TerceroService.consultarDatosExternos).toHaveBeenCalledWith("13", "52082117");
    });

    it("no consulta el proveedor externo si el tercero ya existe localmente", async () => {
        vi.mocked(TerceroService.search).mockResolvedValue([terceroExistente]);
        renderSuppliersMaster();

        const user = userEvent.setup();
        await selectTipoDocumento("4");
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "1018511502");
        await user.tab();

        await screen.findByPlaceholderText("Primer nombre");
        expect(TerceroService.consultarDatosExternos).not.toHaveBeenCalled();
    });

    it("no bloquea el formulario si la consulta externa falla", async () => {
        vi.mocked(TerceroService.search).mockResolvedValue([]);
        vi.mocked(TerceroService.consultarDatosExternos).mockRejectedValue(new Error("network error"));
        renderSuppliersMaster();

        const user = userEvent.setup();
        await selectTipoDocumento("4");
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "999999999");
        await user.tab();

        const inputRazonSocial = screen.getByPlaceholderText("Razón social");
        expect(inputRazonSocial).toHaveValue("");
        await user.type(inputRazonSocial, "Prueba Manual");
        expect(inputRazonSocial).toHaveValue("Prueba Manual");
    });

    it("no repite la consulta externa para el mismo número de identificación", async () => {
        vi.mocked(TerceroService.search).mockResolvedValue([]);
        vi.mocked(TerceroService.consultarDatosExternos).mockResolvedValue({
            message: null,
            email: "astridiazc@gmail.com",
            name: "DIAZ CAMACHO ASTRID",
        });
        renderSuppliersMaster();

        const user = userEvent.setup();
        await selectTipoDocumento("4");
        const inputIdentificacion = await screen.findByPlaceholderText("Número de identificación");
        await user.type(inputIdentificacion, "52082117");
        await user.tab();
        await screen.findByPlaceholderText("Razón social");

        await user.click(inputIdentificacion);
        await user.tab();

        expect(TerceroService.consultarDatosExternos).toHaveBeenCalledTimes(1);
    });
});
