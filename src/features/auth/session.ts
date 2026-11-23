export interface AuthenticatedSession {
  usuario: string;
  idRol: number;
}

export const AUTH_SESSION_KEY = "astil.authenticatedSession";

export function getAuthenticatedSession(): AuthenticatedSession | null {
  const storedSession = localStorage.getItem(AUTH_SESSION_KEY);
  if (!storedSession) return null;

  try {
    const session: unknown = JSON.parse(storedSession);
    if (
      typeof session !== "object" ||
      session === null ||
      !("usuario" in session) ||
      typeof session.usuario !== "string" ||
      !("idRol" in session) ||
      typeof session.idRol !== "number" ||
      !Number.isInteger(session.idRol) ||
      session.idRol <= 0
    ) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    return { usuario: session.usuario, idRol: session.idRol };
  } catch {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}
