import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import ConsentBanner from "./components/ConsentBanner";
import StarsBackground from "./components/ui/StarsBackgroud";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <StarsBackground />
      <AppRouter />
      <ConsentBanner />
    </>
  </StrictMode>
);
