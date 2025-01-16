import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  TextField,
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
    if (unidadesCompradas > 0) {
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
        console.log("Orden actualizada:", nuevaOrden);
        return nuevaOrden;
      });
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

    const { data, error } = await supabase.from("Ventas").insert([
      {
        ProductAfectados: productosAfectados,
        MontoPagado: montoPagado,
      },
    ]);

    if (error) {
      console.error("Error al registrar la venta:", error);
    } else {
      console.log("Venta registrada:", data);
    }
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
    <Dialog open={true} fullWidth maxWidth="md">
      <DialogTitle>Administrar Orden</DialogTitle>
      <DialogContent>
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
                    onChange={(e) =>
                      handleUnidadesChange(producto.Codigo, e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleComprar(producto.Codigo)}
                  >
                    Comprar
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
      </DialogContent>
    </Dialog>
  );
};

export default OrderManage;
