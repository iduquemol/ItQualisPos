// Panel derecho intencionalmente vacío: la navegación ahora vive en el
// sidebar persistente (src/components/layout/AppSidebar.tsx). Esta página
// es solo el destino por defecto tras el login, antes de elegir un módulo.
export default function MainMenu() {
  return <div className="min-h-screen bg-muted" />;
}