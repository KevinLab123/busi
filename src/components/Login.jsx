import * as React from "react";
import { Button, TextField, Box } from "@mui/material";
import { client as supabase } from "../supabase/Client";

const Login = () => {
  const signIn = async (email, password) => {
    const { data, error } = await supabase
      .from("Perfiles")
      .select("Usuario")
      .eq("Contrasena", password);

    if (error) {
      console.error("Error al actualizar el producto:", error);
      return;
    }

    console.log("Producto actualizado en la base de datos:", data);

    if (data.length > 0) {
      console.log("Usuario logueado");
    } else {
      console.log("Usuario no logueado");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    await signIn(email, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
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
        Sign In
      </Button>
    </Box>
  );
};

export default Login;