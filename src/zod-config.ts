import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import es from 'zod-i18n-map/locales/es/zod.json';
import i18next from 'i18next';

// Inicializa i18next con las traducciones en español.
// La biblioteca zod-i18n-map depende de i18next para funcionar.
i18next.init({
  lng: 'es',
  resources: {
    es: { zod: es },
  },
});

// Establece el mapa de errores global para Zod.
z.setErrorMap(zodI18nMap);

// Opcional: Exportar zod configurado si quieres importarlo desde un solo lugar
export { z };