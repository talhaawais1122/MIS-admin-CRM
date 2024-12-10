import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserContextProvider from "./ContextApi/UserContextProvider";

function App() {
  return (

    <UserContextProvider>
       <div>
      <Outlet />
    </div>
    </UserContextProvider>
   
  );
}

export default App;
