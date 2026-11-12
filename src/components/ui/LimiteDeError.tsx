import { Component, type ErrorInfo, type ReactNode } from "react";

interface LimiteDeErrorProps {
  /** Para el aviso en la consola: qué parte falló. */
  nombre: string;
  children: ReactNode;
  /** Qué se muestra si falla; por defecto, nada (la sección desaparece). */
  respaldo?: ReactNode;
}

interface LimiteDeErrorEstado {
  fallo: boolean;
}

/*
  LÍMITE DE ERROR (Error Boundary)
  Si algo dentro falla al dibujarse (por ejemplo, un dato mal escrito en
  src/config), solo se pierde esa parte y el resto de la página sigue
  funcionando. El error queda en la consola del navegador con su nombre.
  React solo permite hacer esto con un componente de clase.
*/
export default class LimiteDeError extends Component<LimiteDeErrorProps, LimiteDeErrorEstado> {
  state: LimiteDeErrorEstado = { fallo: false };

  static getDerivedStateFromError(): LimiteDeErrorEstado {
    return { fallo: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error(`[${this.props.nombre}] no se pudo mostrar:`, error, info.componentStack);
  }

  render(): ReactNode {
    return this.state.fallo ? (this.props.respaldo ?? null) : this.props.children;
  }
}
