import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';
import { createRouteElement } from './components/RouteRenderer';
import { getHeaderPaths, routes } from './config/routes';

// Appコンポーネントの内部でHeaderの表示を制御するためのコンポーネント
const AppContent = () => {
  const location = useLocation();
  const headerPaths = getHeaderPaths();
  const showHeader = headerPaths.includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={createRouteElement({ route, showHeader })}
        />
      ))}
    </Routes>
  );
};

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
