import { BrowserRouter, Routes, Route, Navigate, useNavigate, Router } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/loginPage';
import POSPage from './pages/pos';
import MainMenuPage from './pages/mainMenuPage';
import ItemsPage from './pages/itemsPage';
import { Toaster } from "@/components/ui/sonner"
import TercerosPage from './pages/tercerosPage';
import { useState } from 'react';
import { toast } from 'sonner';
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

function App() {
    // Aquí podrías agregar lógica para verificar autenticación
    //const isAuthenticated = true; // Ejemplo, reemplazar con tu lógica real
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function LoginHandlerWrapper() {
        const navigate = useNavigate();

        const handleLogin = (user: { usuario: string; password: string }) => {
            if (user.usuario === "administrador" && user.password === "astil2025") {
                setIsAuthenticated(true);
                navigate("/main-menu");
                return true;
            } else {
                setIsAuthenticated(false);
                toast.error("Usuario o contraseña incorrectos", {
                    position: "bottom-center",
                });
                return false;
            }
        };



        return (
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/main-menu" element={
                    isAuthenticated ? <AppLayout><MainMenuPage /></AppLayout> : <Navigate to="/login" />
                } />
                <Route path="/items" element={
                    isAuthenticated ? <AppLayout><ItemsPage /></AppLayout> : <Navigate to="/login" />
                } />
                <Route path="/terceros" element={
                    isAuthenticated ? <AppLayout><TercerosPage /></AppLayout> : <Navigate to="/login" />
                } />
                <Route path="/reporte" element={
                    // isAuthenticated ? <FacturaReportPage /> : <Navigate to="/login" />
                    <FacturaReportPage />
                } />
                <Route path="/empresas" element={
                    isAuthenticated ? <AppLayout><EmpresasPage /></AppLayout> : <Navigate to="/login" />
                } />
                <Route path="/resoluciones" element={
                    isAuthenticated ? <AppLayout><ResolutionsPage /></AppLayout> : <Navigate to="/login" />
                } />
                <Route
                    path="/pos"
                    element={
                        isAuthenticated ? <AppLayout><POSPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/parametros-venta"
                    element={
                        isAuthenticated ? <AppLayout><ParametrosVentasPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/documentos-externos"
                    element={
                        isAuthenticated ? <AppLayout><DocumentosExternosPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/categories"
                    element={
                        isAuthenticated ? <AppLayout><CategoriesPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/credit-notes"
                    element={
                        isAuthenticated ? <AppLayout><CreditNotePage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/estimates"
                    element={
                        isAuthenticated ? <AppLayout><EstimatePage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/actividades-ica"
                    element={
                        isAuthenticated ? <AppLayout><ActividadesIcaPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/sucursales"
                    element={
                        isAuthenticated ? <AppLayout><SucursalesPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/vendedores"
                    element={
                        isAuthenticated ? <AppLayout><SellersPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/usuarios"
                    element={
                        isAuthenticated ? <AppLayout><UsersPage /></AppLayout> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/unidades-medida"
                    element={
                        isAuthenticated ? <UnidadesDeMedidaPage /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/listas-precios"
                    element={
                        isAuthenticated ? <ListasPreciosPage /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <AppLayout><POSPage /></AppLayout>
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