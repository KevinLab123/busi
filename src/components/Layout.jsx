import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import ProductsTable from "./ProductsTable";
import OrderManage from "./OrderManage";
import InvViewer from "./InvViewer";
import InvMovements from "./InvMovements";
import MovViewer from "./MovViewer";

const NAVIGATION = [
  {
    segment: "Ordenes",
    title: "Ordenes",
    icon: <DashboardIcon />,
  },
  {
    segment: "Inventario",
    title: "Inventario",
    icon: <ShoppingCartIcon />,
  },

  {
    segment: "Gestion", // Sin tilde
    title: "Gestión", // Aquí sí puede tener tilde (es solo texto)
    icon: <ShoppingCartIcon />,
  },

  {
    segment: "productos", // Nueva ruta
    title: "Productos",
    icon: <ShoppingCartIcon />, // Puedes usar otro ícono si lo prefieres
  },

  {
    segment: "movimientos", // Nueva ruta
    title: "Movimientos",
    icon: <ShoppingCartIcon />, // Puedes usar otro ícono si lo prefieres
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  let content;

  // Si no hay un pathname válido, carga el componente por defecto (Ordenes)
  switch (pathname || "/Ordenes") {
    case "/Ordenes":
      content = <OrderManage />;
      break;
    case "/Inventario":
      content = <InvViewer />;
      break;
    case "/productos":
      content = <ProductsTable />;
      break;
    case "/Gestion":
      content = <InvMovements />;
      break;
    case "/movimientos":
      content = <MovViewer />;
      break;
    default:
      content = <OrderManage />; // Componente por defecto
  }

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Layout(props) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: "MUI",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Layout;
