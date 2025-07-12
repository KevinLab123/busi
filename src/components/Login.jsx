import * as React from "react";
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { client as supabase } from "../supabase/Client";
import Layout from "./Layout"; // Importa el componente Layout
import "../CSS/Login.css";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario está logueado
  const [errorMessage, setErrorMessage] = useState(""); // Nuevo estado para el error

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from("Perfiles")
        .select("Usuario, Contrasena")
        .eq("Usuario", email)
        .eq("Contrasena", password);

      if (error) {
        console.error("Error al consultar la tabla Perfiles:", error);
        setErrorMessage("Ocurrió un error. Intenta de nuevo.");
        return;
      }

      if (data.length > 0) {
        setIsLoggedIn(true);
        setErrorMessage(""); // Limpia el error si inicia sesión
      } else {
        setErrorMessage("Correo o contraseña incorrecta");
      }
    } catch (error) {
      console.error("Error al realizar la consulta:", error);
      setErrorMessage("Ocurrió un error. Intenta de nuevo.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    await signIn(email, password);
  };

  // Si el usuario está logueado, renderiza el componente Layout
  if (isLoggedIn) {
    return <Layout />;
  }

  // Si no está logueado, muestra el formulario de inicio de sesión
  return (
    <main>
      <Box className="login-main">
        <Paper elevation={6} className="login-paper">
          <Avatar className="login-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="login-title">
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            {errorMessage && (
              <Typography className="login-error">{errorMessage}</Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </main>
  );
};

export default Login;
