import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
];

/*
SIGUIENTE CONJUNTO DE PAQUETES ABRIR board.coomponent.ts, board.component.html, board.component.scss

import { Routes } from '@angular/router';: Importa el tipo Routes desde la librería del Router de Angular. Este tipo es, esencialmente, un array de objetos de ruta (Route[]).

import { BoardComponent } from '../board.component';: Importa tu BoardComponent para que pueda ser utilizado en la configuración de las rutas.

export const routes: Routes = [ ... ];: Declara y exporta una constante llamada routes. Esta constante contiene la configuración de todas las rutas de nivel superior de tu aplicación.

{ path: '', component: BoardComponent }: Este es el objeto de configuración para tu ruta principal.

path: '': Define la ruta de la URL. Una cadena vacía ('') representa la ruta raíz de tu aplicación (por ejemplo, http://localhost:4200/).
component: BoardComponent: Le indica al router que, cuando un usuario navegue a la ruta raíz, debe cargar y mostrar el BoardComponent.


*/