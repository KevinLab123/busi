import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { client as supabase } from "../supabase/Client";

const Product = ({ open, handleClose }) => {
  const [producto, setProducto] = useState({
    precio: "",
    nombre: "",
    codigo: "",
  });

  // Manejador de cambios para todos los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "precio" && isNaN(value)) {
      console.log("El precio debe ser un número");
      return;
    }
    // Actualiza el estado correspondiente usando el atributo name
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const { codigo, precio, nombre } = producto;
    if (!codigo || !precio || !nombre) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    try {
      console.log({ precio, nombre, codigo });

      // Insertar el producto en la base de datos
      const { data, error } = await supabase
        .from("Productos")
        .insert([{ Codigo: codigo, Nombre: nombre, Precio: precio }]);

      if (error) {
        console.log("Error al agregar el producto:", error);
        throw error;
      }

      console.log("Producto agregado:", data);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Registrar Producto</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            id="codigo"
            name="codigo"
            label="Código"
            variant="outlined"
            value={producto.codigo}
            onChange={handleChange}
          />
          <TextField
            id="precio"
            name="precio"
            label="Precio"
            variant="outlined"
            value={producto.precio}
            onChange={handleChange}
          />
          <TextField
            id="nombre"
            name="nombre"
            label="Nombre"
            variant="outlined"
            value={producto.nombre}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleRegister}
        >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Product;
