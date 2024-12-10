import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App'

import './index.css';
import GetAllCampaigns from './Components/Campaign/GetAllCampaigns/GetAllCampaigns';
import LeadsDashboard from './Components/Leads/LeadsDashboard'
import LeadDetails from './Components/Leads/LeadsDetails';
import CreateTag from './Components/Tags/CreateTag'

const router = createBrowserRouter([
  {
    path: '/', 
    element: <App />, 
    children: [
   
  
   {
    path: "campaign",
    element: <GetAllCampaigns />
   },

   {
    path : 'leadsDashboard',
    element : <LeadsDashboard></LeadsDashboard>
   },
   {
    path : 'leadDetails',
    element : <LeadDetails />
   },
   {
    path : 'tags',
    element : <CreateTag />
   }

      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
