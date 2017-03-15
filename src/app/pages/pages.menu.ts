export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'home',
        data: {
          menu: {
            title: 'Home',
            icon: 'ion-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Store',
            icon: 'ion-clipboard',
            selected: false,
            expanded: false,
            order: 100
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'User Manager',
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
            title: 'Logout',
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
