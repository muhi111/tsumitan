type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
};

const navItems: NavItem[] = [//MUIIcons
  { icon: 'home', label: 'Home' },
  { icon: 'school', label: 'Learn' },
  { icon: 'import_contacts', label: 'Dictionary', active: true },
  { icon: 'person_outline', label: 'Profile' },
];

const Footer = () => {
  return (
    <footer className="w-full sticky bottom-0 bg-slate-50/80 backdrop-blur-sm border-t border-slate-200">
      <nav className="flex justify-around px-2 py-2 max-w-screen-xl mx-auto">
        {navItems.map(({ icon, label, active }) => (
          <a
            key={label}
            className={`flex flex-1 flex-col items-center justify-end gap-0.5 py-1 ${
              active ? 'text-blue-500' : 'text-slate-500'
            }`}
            href="#"
          >
            <span className="material-icons text-2xl">{icon}</span>
            <p className="text-[0.7rem] sm:text-xs font-medium tracking-wide">{label}</p>
          </a>
        ))}
      </nav>
      <div className="h-safe-area-bottom bg-slate-50" />
    </footer>
  );
};

export default Footer;
