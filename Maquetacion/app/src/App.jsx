// src/App.jsx
import { useState } from 'react';
import Login from './pages/Login.jsx';
import DashboardAdmin from './components/DashboardAdmin.jsx';
import DashboardUser from './components/DashboardUser.jsx';

function App() {
  const [userRole, setUserRole] = useState(null); // null | 'admin' | 'user'

  return (
    <>
      {!userRole && <Login setUserRole={setUserRole} />}

      {userRole === 'admin' && <DashboardAdmin />}
      {userRole === 'user' && <DashboardUser />}
    </>
  );
}

export default App;