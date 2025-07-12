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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { client as supabase } from "../supabase/Client";
import "../CSS/InvMovements.css"; // Solo este import, si tienes estilos propios

// Datos a capturar
let cantidad = 0;
let Descripcion = "";
let fecha = "";

let producto = {
  Codigo: 0,
  Nombre: "",
  Precio: 0,
  Unidades: 0,
};

// Función para buscar un producto por su código y almacenar la información
const handleCodeSearch = async (codigo) => {
  try {
    const { data, error } = await supabase
      .from("Productos")
      .select("Codigo, Nombre, Precio, Unidades")
      .eq("Codigo", codigo)
      .single();

    if (error) {
      console.error("Error al obtener el producto:", error);
      return;
    }

    producto = {
      Codigo: data.Codigo,
      Nombre: data.Nombre,
      Precio: data.Precio,
      Unidades: data.Unidades, // Asegúrate de que este campo se selecciona correctamente
    };

    console.log("Producto obtenido:", producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
};

const sumEvent = async (unidades) => {
  try {
    producto.Unidades += unidades;
    const { data: updateData, error: updateError } = await supabase
      .from("Productos")
      .update({ Unidades: producto.Unidades })
      .eq("Codigo", producto.Codigo);

    if (updateError) {
      console.error("Error al actualizar el producto:", updateError);
      return;
    }

    console.log("Producto actualizado en la base de datos:", updateData);

    // Crear un nuevo registro en la tabla Movimientos
    const { data: insertData, error: insertError } = await supabase
      .from("MovInventario")
      .insert([
        {
          Fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
          TipoMov: "Entrada",
          ProductAfectado: producto.Codigo,
          Unidades: unidades,
        },
      ]);

    if (insertError) {
      console.error("Error al insertar el movimiento:", insertError);
      return;
    }

    console.log("Movimiento insertado en la base de datos:", insertData);
  } catch (error) {
    console.error(
      "Error al actualizar el producto en la base de datos:",
      error
    );
  }
};

const restEvent = async (unidades) => {
  try {
    producto.Unidades -= unidades;
    const { data: updateData, error: updateError } = await supabase
      .from("Productos")
      .update({ Unidades: producto.Unidades })
      .eq("Codigo", producto.Codigo);

    if (updateError) {
      console.error("Error al actualizar el producto:", updateError);
      return;
    }

    console.log("Producto actualizado en la base de datos:", updateData);

    // Crear un nuevo registro en la tabla Movimientos
    const { data: insertData, error: insertError } = await supabase
      .from("MovInventario")
      .insert([
        {
          Fecha: new Date().toISOString().split("T")[0],
          TipoMov: "Salida",
          ProductAfectado: producto.Codigo,
          Unidades: unidades,
        },
      ]);

    if (insertError) {
      console.error("Error al insertar el movimiento:", insertError);
      return;
    }

    console.log("Movimiento insertado en la base de datos:", insertData);
  } catch (error) {
    console.error(
      "Error al actualizar el producto en la base de datos:",
      error
    );
  }
};

const manualEvent = async (unidades) => {
  let tipoMovimiento = "Manual";

  if (unidades > producto.Unidades) {
    tipoMovimiento = "Entrada Manual";
  } else {
    tipoMovimiento = "Salida Manual";
  }

  try {
    producto.Unidades = unidades;
    const { data: updateData, error: updateError } = await supabase
      .from("Productos")
      .update({ Unidades: producto.Unidades })
      .eq("Codigo", producto.Codigo);

    if (updateError) {
      console.error("Error al actualizar el producto:", updateError);
      return;
    }

    console.log("Producto actualizado en la base de datos:", updateData);

    // Crear un nuevo registro en la tabla Movimientos
    const { data: insertData, error: insertError } = await supabase
      .from("MovInventario")
      .insert([
        {
          Fecha: new Date().toISOString(),
          TipoMov: tipoMovimiento,
          ProductAfectado: producto.Codigo,
          Unidades: unidades,
        },
      ]);

    if (insertError) {
      console.error("Error al insertar el movimiento:", insertError);
      return;
    }

    console.log("Movimiento insertado en la base de datos:", insertData);
  } catch (error) {
    console.error(
      "Error al actualizar el producto en la base de datos:",
      error
    );
  }
};

const InvMovements = () => {
  const [codigo, setCodigo] = useState("");
  const [unidades, setUnidades] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("sumEvent");

  const handleChange = (e) => {
    setCodigo(e.target.value);
  };

  const handleUnidadesChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      console.log("Solo se admiten números");
      return;
    }
    setUnidades(value);
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleSubmit = async () => {
    await handleCodeSearch(codigo);
    if (selectedEvent === "sumEvent") {
      await sumEvent(Number(unidades));
    } else if (selectedEvent === "restEvent") {
      await restEvent(Number(unidades));
    } else if (selectedEvent === "manualEvent") {
      await manualEvent(Number(unidades));
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
        />
        <TextField
          id="unidades"
          name="unidades"
          label="Unidades"
          variant="outlined"
          value={unidades}
          onChange={handleUnidadesChange}
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
        >
          Aceptar
        </Button>
      </Box>
    </Container>
  );
};

export default InvMovements;
