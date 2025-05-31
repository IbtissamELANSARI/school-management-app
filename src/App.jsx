import { BrowserRouter as Router } from 'react-router';
import RouteConfig from './routes/RouteConfig';
import { useState, useEffect } from 'react';
import { AbilityContext, createAbility } from './contexts/AbilityContext';
import axios from '@/api/axios';

const isProduction = import.meta.env.PROD;
const basename = isProduction ? '/school-management-app' : '/';

function App() {

  const [ability, setAbility] = useState(createAbility([]));

useEffect(() => {
  // Fetch user permissions after login
  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/api/user/permissions');
      const newAbility = createAbility(response.data.permissions || []); // fallback to empty array
      setAbility(newAbility);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  fetchPermissions();
}, []);

  return (
    <AbilityContext.Provider value={ability}>
      <Router
        basename={basename}
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <RouteConfig />
      </Router>
    </AbilityContext.Provider>
  );
}

export default App;
