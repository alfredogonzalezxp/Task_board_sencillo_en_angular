import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
/*

import { bootstrapApplication } from '@angular/platform-browser';

Importa la función bootstrapApplication desde la librería de Angular para navegadores. Esta es la función clave necesaria para iniciar una aplicación moderna basada en componentes standalone.
import { App } from './app/app';

Importa tu componente raíz, la clase App que está definida en src/app/app.ts. Este es el componente principal que contendrá a todos los demás.
import { appConfig } from './app/app.config';

Importa el objeto appConfig desde src/app/app.config.ts. Este objeto contiene toda la configuración global de la aplicación, como las rutas (provideRouter), las animaciones (provideAnimations), etc.
bootstrapApplication(App, appConfig)

Esta es la instrucción principal. Llama a la función de arranque de Angular y le pasa dos cosas:
App: El componente que debe usar como el componente raíz de la aplicación.
appConfig: El objeto con toda la configuración de proveedores y funcionalidades que estarán disponibles para toda la aplicación.
.catch((err) => console.error(err));

Esto es un manejo de errores. Si por alguna razón el proceso de arranque de la aplicación falla (por ejemplo, una configuración incorrecta o un error crítico), este .catch() atrapará el error y lo mostrará en la consola del navegador. Es una medida de seguridad esencial para depurar problemas de inicio.



*/