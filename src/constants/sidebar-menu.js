import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';

function getSidebarMenu(role) {
    if (role === "admin") {
      return [
        {
          id: 1,
          icon: DashboardIcon,
          path: '/',
          title: 'Dashboard',
        },
        {
          id: 2,
          icon: ProductIcon,
          path: '/orders',
          title: 'Orders',
        },
        {
          id: 3,
          icon: ShippingIcon,
          path: '/products',
          title: 'Products',
        },
        {
          id: 4,
          icon: UserIcon,
          path: '/profile',
          title: 'My account',
        },
        {
          id: 5,
          icon: UserIcon,
          path: '/registeremployee',
          title: 'Register Employee',
        },
        {
          id: 6,
          icon: UserIcon,
          path: '/manageremployee',
          title: 'Manage Employee',
        }
      ]
    }
    if (role === "customer") {
      return [
        {
          id: 1,
          icon: DashboardIcon,
          path: '/',
          title: 'Dashboard',
        },
        {
          id: 2,
          icon: ProductIcon,
          path: '/orders',
          title: 'Orders',
        },
        {
          id: 3,
          icon: UserIcon,
          path: '/cart',
          title: 'Cart',
        },
        {
          id: 4,
          icon: UserIcon,
          path: '/profile',
          title: 'My account',
        }
      ]
    }
    if (role === "employee") {
      return [
        {
          id: 1,
          icon: DashboardIcon,
          path: '/',
          title: 'Dashboard',
        },
        {
          id: 2,
          icon: ProductIcon,
          path: '/orders',
          title: 'Orders',
        },
        {
          id: 3,
          icon: ShippingIcon,
          path: '/products',
          title: 'Products',
        },
        {
          id: 4,
          icon: UserIcon,
          path: '/accountcustomer',
          title: 'Customer account',
        },
        {
          id: 5,
          icon: UserIcon,
          path: '/profile',
          title: 'My account',
        },
      ]
    }
    else{
        return [
            {
                id: 1,
                icon: UserIcon,
                path: '/login',
                title: 'Login',
            }
        ]
    }
  }
  
  export default getSidebarMenu
