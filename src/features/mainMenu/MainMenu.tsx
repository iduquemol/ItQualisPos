import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react"; // Asegúrate de tener este import

const menuItems = [
  { label: "Ventas", icon: "🛒", color: "bg-blue-100", route: "/pos" },
  { label: "Items", icon: "📦", color: "bg-green-100", route: "/items" },
  { label: "Terceros", icon: "👥", color: "bg-blue-100", route: "/terceros" },
  // { label: "Reporte", icon: "📊", color: "bg-red-100", route: "/reporte" }
];

const filtros = [
  { label: "Todos", color: "bg-gray-500 text-white" },
  { label: "Ventas", color: "bg-black text-white" },
];

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-muted min-h-screen">
      {/* Logo y título principal */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-primary p-3 rounded-lg">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Astil</h1>
          <p className="text-sm text-muted-foreground">Sistema de Punto de Venta</p>
        </div>
      </div>
      {/* Filtros y título de menú */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Menú Principal</h2>
        <div className="flex flex-wrap gap-2">
          {filtros.map(f => (
            <Button
              key={f.label}
              variant="secondary"
              className={`rounded ${f.color} px-4 py-1 text-sm font-semibold`}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {menuItems.map((item) => (
          <Card
            key={item.label}
            onClick={() => navigate(item.route)}
            className="relative flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-white to-gray-100 shadow-md border-0 hover:shadow-xl transition-all group cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={`Ir a ${item.label}`}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(item.route);
              }
            }}
          >
            {/* Icono grande */}
            <div className={`relative flex items-center justify-center mb-4`}>
              <span
                className={`text-5xl transition-transform group-hover:-translate-y-1 group-hover:scale-110 duration-200 ${item.color}`}
                style={{ borderRadius: "50%", padding: "0.75rem" }}
              >
                {item.icon}
              </span>
            </div>
            {/* Título con subrayado animado */}
            <div className="text-center">
              <div className="text-lg font-semibold relative">
                {item.label}
                <span className="block h-0.5 w-0 bg-primary mx-auto transition-all duration-300 group-hover:w-2/3"></span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}