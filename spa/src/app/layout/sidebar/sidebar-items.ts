import { RouteInfo } from './sidebar.metadata';
export const ROUTES: RouteInfo[] = [
  {
    path: '/flights',
    title: 'Flights',
    moduleName: 'AuditorDashboard',
    iconType: 'material-icons-two-tone',
    icon: 'flight',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
  },

  {
    path: '/check-in',
    title: 'Check-In',
    moduleName: 'AuditorUpload',
    iconType: 'material-icons-two-tone',
    icon: 'luggage',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
  },

  {
    path: '/Flight Status',
    title: 'Flight Status',
    moduleName: 'AuditorVenues',
    iconType: 'material-icons-two-tone',
    icon: 'schedule',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
  },

  {
    path: '/Profile',
    title: 'Profile',
    moduleName: 'AuditorApprovers',
    iconType: 'material-icons-two-tone',
    icon: 'account_circle',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
  }

];
