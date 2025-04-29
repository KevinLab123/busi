import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { client as supabase } from "../supabase/Client";

const fetchProductos = async (setProductos) => {
  const { data, error } = await supabase
    .from("Productos")
    .select("Codigo, Nombre, Precio, Unidades");

  if (error) {
    console.error("Error al obtener los productos:", error);
  } else {
    setProductos(data);
  }
};

const OrderManage = () => {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [unidades, setUnidades] = useState({});

  useEffect(() => {
    fetchProductos(setProductos);
  }, []);

  const handleUnidadesChange = (codigo, value) => {
    setUnidades((prevUnidades) => ({
      ...prevUnidades,
      [codigo]: value,
    }));
  };

  const handleComprar = (codigo) => {
    const unidadesCompradas = parseInt(unidades[codigo], 10) || 0;
      
    // Buscar el producto seleccionado
    const productoSeleccionado = productos.find(
      (producto) => producto.Codigo === codigo
    );

    if (!productoSeleccionado) {
      console.error("Producto no encontrado.");
      return;
    }

    // Verificar si hay suficientes unidades disponibles
    if (productoSeleccionado.Unidades === 0) {
      console.error(`No hay unidades disponibles del producto: ${productoSeleccionado.Nombre}`);
      return;
    }

    if (productoSeleccionado.Unidades < unidadesCompradas) {
      console.error(
        `No hay suficientes existencias para el producto: ${productoSeleccionado.Nombre}. ` +
        `Unidades disponibles: ${productoSeleccionado.Unidades}, ` +
        `Unidades solicitadas: ${unidadesCompradas}`
      );
      return;
    }

    // Si hay suficientes unidades, agregar el producto a la orden
    if (unidadesCompradas > 0) {
      console.log("Producto seleccionado:", productoSeleccionado);
      console.log("Unidades previas:", productoSeleccionado.Unidades);
      console.log("Cantidad seleccionada:", unidadesCompradas);

      setOrden((prevOrden) => {
        const productoExistente = prevOrden.find(
          (item) => item.Codigo === codigo
        );
        let nuevaOrden;
        if (productoExistente) {
          nuevaOrden = prevOrden.map((item) =>
            item.Codigo === codigo
              ? { ...item, Unidades: item.Unidades + unidadesCompradas }
              : item
          );
        } else {
          nuevaOrden = [
            ...prevOrden,
            { Codigo: codigo, Unidades: unidadesCompradas },
          ];
        }
        return nuevaOrden;
      });

      console.log("Orden actualizada:", orden);
    }
  };

  const calcularMontoPagado = () => {
    return orden.reduce((total, item) => {
      const producto = productos.find(
        (producto) => producto.Codigo === item.Codigo
      );
      return total + producto.Precio * item.Unidades;
    }, 0);
  };

  const handleRegister = async () => {
    if (orden.length === 0) {
      console.error("No hay productos en la orden.");
      return;
    }

    const productosAfectados = JSON.stringify(orden);
    const montoPagado = calcularMontoPagado(); // Calcular el monto pagado

    // Registrar la venta en la tabla "Ventas"
    const { data, error } = await supabase.from("Ventas").insert([
      {
        ProductAfectados: productosAfectados,
        MontoPagado: montoPagado,
      },
    ]);

    if (error) {
      console.error("Error al registrar la venta:", error);
      return;
    } else {
      console.log("Venta registrada:", data);
    }

    // Actualizar las unidades en la base de datos
    for (const item of orden) {
      const productoSeleccionado = productos.find(
        (producto) => producto.Codigo === item.Codigo
      );

      if (productoSeleccionado) {
        const nuevasUnidades = productoSeleccionado.Unidades - item.Unidades;

        // Actualizar las unidades en la base de datos
        const { error: updateError } = await supabase
          .from("Productos")
          .update({ Unidades: nuevasUnidades })
          .eq("Codigo", item.Codigo);

        if (updateError) {
          console.error(
            `Error al actualizar el producto con código ${item.Codigo}:`,
            updateError
          );
        } else {
          console.log(
            `Producto con código ${item.Codigo} actualizado. Nuevas unidades: ${nuevasUnidades}`
          );
        }
      }
    }

    // Actualizar el estado local de los productos
    setProductos((prevProductos) =>
      prevProductos.map((producto) => {
        const productoEnOrden = orden.find(
          (item) => item.Codigo === producto.Codigo
        );
        if (productoEnOrden) {
          return {
            ...producto,
            Unidades: producto.Unidades - productoEnOrden.Unidades,
          };
        }
        return producto;
      })
    );

    // Limpiar la orden después de registrar la venta
    setOrden([]);
    console.log("Unidades actualizadas y orden registrada correctamente.");
  };

  const handlePrintInvoice = async () => {
    const { data, error } = await supabase.from("Ventas").select("*");

    if (error) {
      console.error("Error al obtener las ventas:", error);
    } else {
      console.log("Datos de las ventas:", data);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administrar Orden
      </Typography>
      <Grid container spacing={2}>
        {productos.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.Codigo}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://th.bing.com/th/id/OIP.JVEgPyFjtMdFt8027-oSIAHaD4?rs=1&pid=ImgDetMain"
                alt={producto.Nombre}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {producto.Nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: ${producto.Precio}
                </Typography>
                <TextField
                  label="Unidades"
                  type="number"
                  value={unidades[producto.Codigo] || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value >= 1 || e.target.value === "") {
                      handleUnidadesChange(producto.Codigo, e.target.value);
                    }
                  }}
                 
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleComprar(producto.Codigo)}
                >
                  Agregar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleRegister}
        sx={{ mt: 2 }}
      >
        Registrar Venta
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handlePrintInvoice}
        sx={{ mt: 2 }}
      >
        Imprimir Factura
      </Button>
    </Box>
  );
};

export default OrderManage;
