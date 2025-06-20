// src/App.jsx

import { useState } from 'react';
import Login from './pages/Login.jsx';
import DashboardAdmin from './components/DashboardAdmin.jsx';
import DashboardUser from './components/DashboardUser.jsx';
import Layout from './components/Layout.jsx'; 

function App() {
  const [userRole, setUserRole] = useState(null); // null | 'admin' | 'user'

  if (!userRole) {
    return <Login setUserRole={setUserRole} />;
  }

  return (
    <Layout>
      {userRole === 'admin' && <DashboardAdmin />}
      {userRole === 'user' && <DashboardUser />}
    </Layout>
  );
}

export default App;