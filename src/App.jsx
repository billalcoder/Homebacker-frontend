import React from 'react';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="font-sans text-stone-800">
      {/* You can add a Navbar here later.
         The <Outlet /> is where the child routes (Register, Login) will appear.
      */}
      <Outlet />
    </div>
  );
};

export default App;