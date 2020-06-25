import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Library',
    icon: {
      icon: 'book',
      pack: 'solid',
    },
    link: '/pages/library',
    home: true,
  },
  {
    title: 'Issue List',
    icon: {
      icon: 'list-ul',
      pack: 'solid',
    },
    link: '/pages/issue',
  },
  
];