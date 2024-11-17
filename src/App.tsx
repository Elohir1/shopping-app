import { Routes, Route } from 'react-router-dom';
import ShoppingListDetail from './components/ShoppingListDetail';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import React from "react";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Domovská stránka / dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Detail nákupního seznamu */}
        <Route path="/shopping-list/:id" element={<ShoppingListDetail />} />
        
        {/* Zde můžete přidat další routy podle potřeby */}
      </Route>
    </Routes>
  );
};

export default App;
