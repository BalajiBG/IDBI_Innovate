import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { HomeIcon, ChatIcon, SpendingIcon, GoalsIcon, ProductsIcon } from './Icons';

export default function BottomNav() {
  const { language } = useLanguage();

  const tabs = [
    { path: '/', labelKey: 'nav_home', Icon: HomeIcon },
    { path: '/chat', labelKey: 'nav_chat', Icon: ChatIcon },
    { path: '/spending', labelKey: 'nav_spending', Icon: SpendingIcon },
    { path: '/goals', labelKey: 'nav_goals', Icon: GoalsIcon },
    { path: '/products', labelKey: 'nav_products', Icon: ProductsIcon }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 shadow-lg z-40">
      <div className="flex justify-around items-center py-2">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-idbi-teal' : 'text-text-secondary hover:text-idbi-orange'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.Icon size={20} color={isActive ? '#00836C' : '#5F7A74'} />
                <span className="text-[10px] font-medium mt-0.5">{t(tab.labelKey, language)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
