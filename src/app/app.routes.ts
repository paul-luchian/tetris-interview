import { Routes } from '@angular/router';
import { RouteType } from './models/route.model';

export const appRoutes: Routes = [
    {
        path: `${RouteType.BASE}`,
        pathMatch: 'full',
        redirectTo: `${RouteType.TETRIS}`
    },
    {
        path: `${RouteType.TETRIS}`,
        loadChildren: () => import('./modules/tetris/tetris.module').then((m) => m.TetrisModule)
    },
    {
        path: `${RouteType.CONFIGURATION}`,
        loadChildren: () => import('./modules/configuration/configuration.module').then((m) => m.ConfigurationModule)
    },
    {
        path: `${RouteType.ANY}`,
        redirectTo: `${RouteType.TETRIS}`
    },
];
