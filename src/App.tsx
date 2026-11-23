import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/loginPage';
import POSPage from './pages/pos';
import MainMenuPage from './pages/mainMenuPage';
import ItemsPage from './pages/itemsPage';
import { Toaster } from "@/components/ui/sonner"
import TercerosPage from './pages/tercerosPage';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { usePermisos } from './context/PermisosContext';
import { AUTH_SESSION_KEY, getAuthenticatedSession } from './features/auth/session';
import FacturaReportPage from './pages/facturaReportPage';
import CreditNotePage from './pages/creditNotePage';
import EstimatePage from './pages/estimatePage';
import EmpresasPage from './pages/empresasPage';
import ResolutionsPage from './pages/resolucionesPage';
import DocumentosExternosPage from './pages/documentosExternosPage';
import CategoriesPage from './pages/categoriasPage';
import ParametrosVentasPage from './pages/parametrosVentasPage';
import ActividadesIcaPage from './pages/ActividadesIcaPage';
import SucursalesPage from './pages/SucursalesPage';
import SellersPage from './pages/VendedoresPage';
import UsersPage from './pages/UsersPage';
import UnidadesDeMedidaPage from './pages/UnidadesDeMedidaPage';
import ListasPreciosPage from './pages/listasPreciosPage';
import DocumentoSoportePage from './pages/DocumentoSoporte';
import AlmacenesPage from './pages/AlmacenesPage';
import DebitNotePage from './pages/debitNotePage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => getAuthenticatedSession() !== null);

    function LoginHandlerWrapper() {
        const navigate = useNavigate();
        const { cargarPermisosPorRol, limpiarPermisos } = usePermisos();

        const handleLogin = async (user: { usuario: string; password: string }) => {
            if (user.usuario === "administrador" && user.password === "astil2025") {
                const session = { usuario: user.usuario, idRol: 1 };
                try {
                    await cargarPermisosPorRol(session.idRol);
                    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
                    setIsAuthenticated(true);
                    navigate("/main-menu");
                } catch (error) {
                    localStorage.removeItem(AUTH_SESSION_KEY);
                    limpiarPermisos();
                    console.error("Error al cargar permisos durante el inicio de sesión:", error);
                    toast.error("No se pudieron cargar los permisos del usuario");
                }
            } else {
                toast.error("Usuario o contraseña incorrectos", {
                    position: "bottom-center",
                });
            }
        };

        const handleLogout = () => {
            localStorage.removeItem(AUTH_SESSION_KEY);
            limpiarPermisos();
            setIsAuthenticated(false);
            navigate("/login", { replace: true });
        };

        const withLayout = (page: ReactNode) => (
            <AppLayout onLogout={handleLogout}>{page}</AppLayout>
        );



        return (
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/main-menu" element={
                    isAuthenticated ? withLayout(<MainMenuPage />) : <Navigate to="/login" />
                } />
                <Route path="/items" element={
                    isAuthenticated ? withLayout(<ItemsPage />) : <Navigate to="/login" />
                } />
                <Route path="/terceros" element={
                    isAuthenticated ? withLayout(<TercerosPage />) : <Navigate to="/login" />
                } />
                <Route path="/reporte" element={
                    isAuthenticated ? withLayout(<FacturaReportPage />) : <Navigate to="/login" />
                } />
                <Route path="/empresas" element={
                    isAuthenticated ? withLayout(<EmpresasPage />) : <Navigate to="/login" />
                } />
                <Route path="/resoluciones" element={
                    isAuthenticated ? withLayout(<ResolutionsPage />) : <Navigate to="/login" />
                } />
                <Route
                    path="/pos"
                    element={
                        isAuthenticated ? withLayout(<POSPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/parametros-venta"
                    element={
                        isAuthenticated ? withLayout(<ParametrosVentasPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/documentos-externos"
                    element={
                        isAuthenticated ? withLayout(<DocumentosExternosPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/categories"
                    element={
                        isAuthenticated ? withLayout(<CategoriesPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/credit-notes"
                    element={
                        isAuthenticated ? withLayout(<CreditNotePage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/estimates"
                    element={
                        isAuthenticated ? withLayout(<EstimatePage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/actividades-ica"
                    element={
                        isAuthenticated ? withLayout(<ActividadesIcaPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/sucursales"
                    element={
                        isAuthenticated ? withLayout(<SucursalesPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/vendedores"
                    element={
                        isAuthenticated ? withLayout(<SellersPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/usuarios"
                    element={
                        isAuthenticated ? withLayout(<UsersPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/unidades-medida"
                    element={
                        isAuthenticated ? withLayout(<UnidadesDeMedidaPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/listas-precios"
                    element={
                        isAuthenticated ? withLayout(<ListasPreciosPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/documento-soporte"
                    element={
                        isAuthenticated ? withLayout(<DocumentoSoportePage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/almacenes"
                    element={
                        isAuthenticated ? withLayout(<AlmacenesPage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/debit-notes"
                    element={
                        isAuthenticated ? withLayout(<DebitNotePage />) : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            withLayout(<POSPage />)
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
            </Routes>
        );
    }

    return (
        <BrowserRouter>
            <Toaster />
            <LoginHandlerWrapper />
        </BrowserRouter>
    );
}

export default App;