import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../../core/guards/auth.guard';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'auto',
        loadComponent: () =>
          import('../auto/auto.page').then((m) => m.AutoPage),
      },
      {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../profile/wishlist/wishlist.page').then((m) => m.WishlistPage),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
