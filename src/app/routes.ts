import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { EventsDashboard } from "./components/events/EventsDashboard";
import { EventDetail } from "./components/events/EventDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: "register", Component: Register },
      { path: "events", Component: EventsDashboard },
      { path: "events/:id", Component: EventDetail },
    ],
  },
], { basename: '/EventDesign' });