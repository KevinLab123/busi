import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { client as supabase } from "../supabase/Client";
import "../CSS/InvMovements.css";

const InvMovements = ({ currentUser }) => {
  const [codigo, setCodigo] = useState("");
  const [unidades, setUnidades] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("sumEvent");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Función para buscar producto - ahora retorna el producto
  const buscarProducto = async (codigoProducto) => {
    try {
      const { data, error } = await supabase
        .from("Productos")
        .select("*")
        .eq("Codigo", codigoProducto)
        .single();

      if (error) {
        console.error("Error al obtener el producto:", error);
        return null;
      }

      console.log("Producto encontrado:", data);
      return data;
    } catch (error) {
      console.error("Error al buscar producto:", error);
      return null;
    }
  };

  // Función para sumar unidades (Entrada)
  const registrarEntrada = async (producto, cantidadSumar, usuario) => {
    try {
      const nuevasUnidades = producto.Unidades + cantidadSumar;

      // Actualizar producto
      const { error: updateError } = await supabase
        .from("Productos")
        .update({ Unidades: nuevasUnidades })
        .eq("Codigo", producto.Codigo);

      if (updateError) {
        console.error("Error al actualizar producto:", updateError);
        return false;
      }

      // Registrar movimiento
      const { error: insertError } = await supabase
        .from("MovInventario")
        .insert({
          Usuario: usuario,
          Fecha: new Date().toISOString().split("T")[0],
          TipoMov: "Entrada",
          ProductAfectado: producto.Codigo,
          Unidades: cantidadSumar,
        })
        .select();

      if (insertError) {
        console.error("Error al insertar movimiento:", insertError);
        return false;
      }

      console.log("Entrada registrada correctamente");
      return true;
    } catch (error) {
      console.error("Error en registrarEntrada:", error);
      return false;
    }
  };

  // Función para restar unidades (Salida)
  const registrarSalida = async (producto, cantidadRestar, usuario) => {
    try {
      const nuevasUnidades = producto.Unidades - cantidadRestar;

      // Actualizar producto
      const { error: updateError } = await supabase
        .from("Productos")
        .update({ Unidades: nuevasUnidades })
        .eq("Codigo", producto.Codigo);

      if (updateError) {
        console.error("Error al actualizar producto:", updateError);
        return false;
      }

      // Registrar movimiento
      const { error: insertError } = await supabase
        .from("MovInventario")
        .insert({
          Usuario: usuario,
          Fecha: new Date().toISOString().split("T")[0],
          TipoMov: "Salida",
          ProductAfectado: producto.Codigo,
          Unidades: cantidadRestar,
        })
        .select();

      if (insertError) {
        console.error("Error al insertar movimiento:", insertError);
        return false;
      }

      console.log("Salida registrada correctamente");
      return true;
    } catch (error) {
      console.error("Error en registrarSalida:", error);
      return false;
    }
  };

  // Función para asignar unidades manualmente
  const registrarManual = async (producto, nuevoTotal, usuario) => {
    try {
      const diferencia = nuevoTotal - producto.Unidades;
      
      if (diferencia === 0) {
        return true; // No hay cambios
      }

      let tipoMovimiento = "Manual";
      if (diferencia > 0) {
        tipoMovimiento = "Entrada Manual";
      } else if (diferencia < 0) {
        tipoMovimiento = "Salida Manual";
      }

      // Actualizar producto
      const { error: updateError } = await supabase
        .from("Productos")
        .update({ Unidades: nuevoTotal })
        .eq("Codigo", producto.Codigo);

      if (updateError) {
        console.error("Error al actualizar producto:", updateError);
        return false;
      }

      // Registrar movimiento con la DIFERENCIA (unidades afectadas)
      const { error: insertError } = await supabase
        .from("MovInventario")
        .insert({
          Usuario: usuario,
          Fecha: new Date().toISOString().split("T")[0],
          TipoMov: tipoMovimiento,
          ProductAfectado: producto.Codigo,
          Unidades: Math.abs(diferencia),
        })
        .select();

      if (insertError) {
        console.error("Error al insertar movimiento:", insertError);
        return false;
      }

      console.log("Asignación manual registrada correctamente");
      return true;
    } catch (error) {
      console.error("Error en registrarManual:", error);
      return false;
    }
  };

  const handleChange = (e) => {
    setCodigo(e.target.value);
  };

  const handleUnidadesChange = (e) => {
    setUnidades(e.target.value);
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getUnidadesLabel = () => {
    switch (selectedEvent) {
      case "sumEvent":
        return "Unidades a Sumar";
      case "restEvent":
        return "Unidades a Restar";
      case "manualEvent":
        return "Nuevo Total de Unidades";
      default:
        return "Unidades";
    }
  };

  const handleSubmit = async () => {
    // Validaciones iniciales
    if (!codigo || !unidades) {
      setSnackbarMessage("Por favor, completa todos los campos");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    const cantidadUnidades = Number(unidades);

    if (isNaN(cantidadUnidades)) {
      setSnackbarMessage("Las unidades deben ser un número válido");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    if (cantidadUnidades <= 0 && selectedEvent !== "manualEvent") {
      setSnackbarMessage("Las unidades deben ser mayor a 0");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    if (cantidadUnidades < 0 && selectedEvent === "manualEvent") {
      setSnackbarMessage("Las unidades no pueden ser negativas");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    // Buscar el producto
    const productoEncontrado = await buscarProducto(codigo);

    if (!productoEncontrado) {
      setSnackbarMessage("Producto no encontrado. Verifica el código.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    let success = false;

    // Ejecutar la operación según el tipo seleccionado
    if (selectedEvent === "sumEvent") {
      success = await registrarEntrada(productoEncontrado, cantidadUnidades, currentUser);
    } else if (selectedEvent === "restEvent") {
      // Validar que haya suficientes unidades
      if (cantidadUnidades > productoEncontrado.Unidades) {
        setSnackbarMessage(
          `No puedes restar ${cantidadUnidades} unidades. Solo hay ${productoEncontrado.Unidades} disponibles.`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      success = await registrarSalida(productoEncontrado, cantidadUnidades, currentUser);
    } else if (selectedEvent === "manualEvent") {
      success = await registrarManual(productoEncontrado, cantidadUnidades, currentUser);
    }

    // Mostrar resultado
    if (success) {
      setSnackbarMessage("¡Movimiento de inventario registrado correctamente!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      // Limpiar los campos
      setCodigo("");
      setUnidades("");
    } else {
      setSnackbarMessage("Error al registrar el movimiento. Revisa la consola para más detalles.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm" className="inv-mov-container">
      <Box className="inv-mov-form">
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          className="inv-mov-title"
        >
          Movimiento de Inventario
        </Typography>
        <TextField
          id="codigo"
          name="codigo"
          label="Código del Producto"
          variant="outlined"
          value={codigo}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          id="unidades"
          name="unidades"
          label={getUnidadesLabel()}
          variant="outlined"
          value={unidades}
          onChange={handleUnidadesChange}
          type="number"
          fullWidth
        />
        <Accordion className="inv-mov-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Seleccionar Tipo de Movimiento</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tipo de Movimiento</FormLabel>
              <RadioGroup
                aria-label="tipo-movimiento"
                name="tipo-movimiento"
                value={selectedEvent}
                onChange={handleEventChange}
              >
                <FormControlLabel
                  value="sumEvent"
                  control={<Radio />}
                  label="Sumar Unidades"
                />
                <FormControlLabel
                  value="restEvent"
                  control={<Radio />}
                  label="Restar Unidades"
                />
                <FormControlLabel
                  value="manualEvent"
                  control={<Radio />}
                  label="Asignar Unidades Manualmente"
                />
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="inv-mov-btn"
          fullWidth
        >
          Aceptar
        </Button>
      </Box>

      {/* Snackbar para mostrar mensajes de éxito o error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InvMovements;
