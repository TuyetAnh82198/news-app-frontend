import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Todo from "./pages/Todo.jsx";
import Settings from "./pages/Settings.jsx";
import Search from "./pages/Search.jsx";
import Page500 from "./pages/Page500.jsx";
import Page404 from "./pages/Page404.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "/news", element: <News /> },
        { path: "/todo", element: <Todo /> },
        { path: "/settings", element: <Settings /> },
        { path: "/search", element: <Search /> },
        { path: "/server-error", element: <Page500 /> },
        { path: "*", element: <Page404 /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
