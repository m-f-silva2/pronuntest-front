import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Sección',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/home.svg',
          label: 'Inicio',
          route: '/',
        },
        {
          //icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Pacientes',
          route: '/dashboard/pacientes',
          /*children: [
            { label: 'Nfts', route: '/dashboard/nfts' },
            // { label: 'Podcast', route: '/dashboard/podcast' },
          ],*/
        },
        /*{
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/shield-exclamation.svg',
          label: 'Erros',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },*/
      ],
    },
    /*{
      group: 'Información',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/information-circle.svg',
          label: 'Quienes somos',
          route: '/info-somos',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Aliados',
          route: '/info-aliados',
        }
      ],
    },
    {
      group: 'Colaboración',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/upload-file.svg',
          label: 'Recolección de audios',
          route: 'www.google.com',
        },
      ],
    },
    /*{
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },*/
  ];
}
