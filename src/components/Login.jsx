import * as React from "react";
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { client as supabase } from "../supabase/Client";
import Layout from "./Layout"; // Importa el componente Layout

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario está logueado

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from("Perfiles")
        .select("Usuario", "Contrasena")
        .eq("Usuario", email)
        .eq("Contrasena", password);

      if (error) {
        console.error("Error al consultar la tabla Perfiles:", error);
        return;
      }

      if (data.length > 0) {
        console.log("Inicio de sesión exitoso:", data[0]);
        setIsLoggedIn(true); // Cambia el estado a logueado
      } else {
        console.log("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al realizar la consulta:", error);
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
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            maxWidth: 400,
            width: "90%",
            textAlign: "center",
          }}
        >
          <Avatar sx={{ m: "auto", bgcolor: "primary.main", mb: 2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={2}>
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
          </Box>
        </Paper>
      </Box>
    </main>
  );
};

export default Login;
