export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'home',
        data: {
          menu: {
            title: 'Inicio',
            icon: 'ion-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'store',
        data: {
          menu: {
            title: 'Inventario',
            icon: 'ion-clipboard',
            selected: false,
            expanded: false,
            order: 100
          }
        }
      },
      {
        path: 'manage',
        data: {
          menu: {
            title: 'Gestion de cuentas',
            icon: 'ion-person-stalker',
            selected: false,
            expanded: false,
            order: 200
          }
        }
      },
      {
        path: 'logout',
        data: {
          menu: {
            title: 'Desconectar',
            icon: 'ion-power',
            selected: false,
            expanded: false,
            order: 1000
          }
        }
      },
    ]
  }
];
