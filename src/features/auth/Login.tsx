import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Lock, Mail, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginProps {
    onLogin: (user: { usuario: string; password: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onLogin({ usuario: email, password });
    };

    // const handleLogin = async (usuario: string, password: string) => {
    //     //e.preventDefault();
    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //         // Aquí iría tu lógica de autenticación
    //         await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
    //         if (usuario === "administrador" && password === "123456") {
    //             // Navegar a main-menu al éxito
    //             navigate('/main-menu');
    //         } else {
    //             // Login fallido
    //             return false;
    //         }


    //     } catch (error) {
    //         setError('Credenciales inválidas');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className="h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="w-full border-b bg-card p-4">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center space-x-4">
                        <div className="bg-primary p-3 rounded-lg">
                            <Package className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Astil</h1>
                            <p className="text-sm text-muted-foreground">Sistema de Punto de Venta</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="text-center space-y-2">
                            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                            <CardDescription>
                                Ingrese sus credenciales para acceder al sistema
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Nombre de usuario"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                            <Button
                                variant="link"
                                className="text-sm text-muted-foreground"
                                type="button"
                            >
                                ¿Olvidó su contraseña?
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            {/* Footer */}
            <div className="border-t p-4 text-center text-sm text-muted-foreground">
                © 2025 It Qualis. Todos los derechos reservados.
            </div>
        </div>
    );
};

export default Login;