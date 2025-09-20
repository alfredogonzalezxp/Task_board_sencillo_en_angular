import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Priority = 'Low' | 'Medium' | 'High' | string;

@Component({
  selector: 'app-legacy-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="legacy-badge inline-block px-2.5 py-1 rounded-2xl text-xs font-semibold text-white uppercase"
      [style.--badge-bg]="priorityBg"
    >
      {{ priority }}
    </span>
  `,
})
export class LegacyBadgeComponent {
  @Input() priority: Priority = 'Medium';

  get priorityBg(): string {
    const p = (this.priority ?? 'Medium').toString().trim().toLowerCase();
    switch (p) {
      case 'low':    return '#22c55e'; // green-500
      case 'medium': return '#fb923c'; // orange-400
      case 'high':   return '#ef4444'; // red-500
      default:       return '#a1a1aa'; // zinc-400 (fallback)
    }
  }
}
/*
Este código define un componente de Angular pequeño y reutilizable llamado LegacyBadgeComponent. Su único propósito es mostrar una "insignia" o "etiqueta" visual que indica la prioridad de una tarea (Low, Medium, o High) con un color de fondo distintivo.

Aquí tienes un desglose de cómo funciona:

1. El Decorador @Component
Esto le dice a Angular cómo tratar la clase LegacyBadgeComponent.

selector: 'app-legacy-badge': Define el nombre de la etiqueta HTML. Para usar este componente, escribirías <app-legacy-badge></app-legacy-badge> en otra plantilla.
standalone: true: Indica que es un componente independiente que no necesita ser declarado en un NgModule.
imports: [CommonModule]: Importa el CommonModule de Angular, que es necesario para usar directivas como [style] en la plantilla.
**template: \...`**: Aquí está el HTML del componente. En lugar de estar en un archivo.html` separado, está directamente en el archivo TypeScript (lo que se conoce como "plantilla en línea").
class="...": Estas son clases de Tailwind CSS que le dan el estilo base a la insignia: inline-block, el espaciado (px-2.5 py-1), los bordes redondeados (rounded-2xl), el tamaño y grosor de la fuente, etc.
[style.--badge-bg]="priorityBg": Esta es la parte clave. Es un enlace de estilo que crea una variable de CSS personalizada llamada --badge-bg. El valor de esta variable se toma del resultado del getter priorityBg de la clase.
{{ priority }}: Muestra el texto de la prioridad (por ejemplo, "High") dentro de la insignia.
2. La Clase LegacyBadgeComponent
Aquí reside la lógica del componente.

@Input() priority: Priority = 'Medium';:

@Input(): Declara que priority es una propiedad de entrada. Esto permite que un componente padre (como TaskCardComponent) le pase el nivel de prioridad, así: <app-legacy-badge [priority]="task.priority"></app-legacy-badge>.
= 'Medium': Establece un valor por defecto. Si el componente padre no le pasa ninguna prioridad, usará 'Medium'.
get priorityBg(): string { ... }:

Esto es un getter de TypeScript. Es una función que se ejecuta cada vez que Angular necesita obtener el valor de priorityBg.
const p = (this.priority ?? 'Medium').toString().trim().toLowerCase();: Esta línea es muy robusta. Toma el valor de priority, se asegura de que no sea nulo (usando 'Medium' como respaldo), lo convierte a string, le quita espacios en blanco y lo pone en minúsculas. Esto hace que la comparación en el switch no sea sensible a mayúsculas/minúsculas (ej. 'high' y 'High' funcionan igual).
switch (p) { ... }: Dependiendo del valor de la prioridad ya normalizada, devuelve un código de color hexadecimal:
'low' -> '#22c55e' (verde)
'medium' -> '#fb923c' (naranja)
'high' -> '#ef4444' (rojo)
default -> '#a1a1aa' (un gris como color de respaldo)
¿Cómo se aplica el color?
El color se aplica gracias a la combinación de la variable CSS que se crea en el HTML y una regla en tu archivo de estilos global c:\Users\Alfrredo\Documents\Angular\TaskBoard\src\styles.scss:

scss
// c:\Users\Alfrredo\Documents\Angular\TaskBoard\src\styles.scss
.legacy-badge {
  background: var(--badge-bg, #a1a1aa) !important;
}
Esta regla le dice al navegador: "Para cualquier elemento con la clase .legacy-badge, usa el valor de la variable --badge-bg como color de fondo. Si esa variable no existe, usa el color gris #a1a1aa"

*/