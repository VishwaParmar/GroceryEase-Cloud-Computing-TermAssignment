import { ChakraProvider, theme } from '@chakra-ui/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout';
import Registration from './pages/Registration';
import Login from './pages/Login';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      {
        path: "/",
        element : <Registration/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path:"/homepage",
        element :<HomePage/>
      }
    ]
}
]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router = {router} ></RouterProvider> 
    </ChakraProvider>
  );
}

export default App;
