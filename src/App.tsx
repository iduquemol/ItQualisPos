import { BrowserRouter, Routes, Route, Navigate, useNavigate, Router } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import POSPage from './pages/pos';
import MainMenuPage from './pages/mainMenuPage';
import ItemsPage from './pages/itemsPage';
import { Toaster } from "@/components/ui/sonner"
import TercerosPage from './pages/tercerosPage';
import { useState } from 'react';
import { toast } from 'sonner';
import FacturaReportPage from './pages/facturaReportPage';

function App() {
    // Aquí podrías agregar lógica para verificar autenticación
    //const isAuthenticated = true; // Ejemplo, reemplazar con tu lógica real
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function LoginHandlerWrapper() {
        const navigate = useNavigate();

        const handleLogin = (user: { usuario: string; password: string }) => {
            if (user.usuario === "administrador" && user.password === "123456") {
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
                    isAuthenticated ? <MainMenuPage /> : <Navigate to="/login" />
                } />
                <Route path="/items" element={
                    isAuthenticated ? <ItemsPage /> : <Navigate to="/login" />
                } />
                <Route path="/terceros" element={
                    isAuthenticated ? <TercerosPage /> : <Navigate to="/login" />
                } />
                <Route path="/reporte" element={
                    // isAuthenticated ? <FacturaReportPage /> : <Navigate to="/login" />
                    <FacturaReportPage />
                } />
                <Route
                    path="/pos"
                    element={
                        // isAuthenticated ? <POSPage /> : <Navigate to="/login" />
                        <POSPage />
                    }
                />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <POSPage />
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