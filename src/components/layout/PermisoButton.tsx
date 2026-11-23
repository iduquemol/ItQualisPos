import { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { AccionPermiso, usePermisos } from "@/context/PermisosContext";

type PermisoButtonProps = ComponentProps<typeof Button> & {
  idOpcion: number;
  accion: AccionPermiso;
};

export default function PermisoButton({
  idOpcion,
  accion,
  disabled,
  ...props
}: PermisoButtonProps) {
  const { tienePermiso } = usePermisos();

  return (
    <Button
      {...props}
      disabled={disabled || !tienePermiso(idOpcion, accion)}
    />
  );
}
