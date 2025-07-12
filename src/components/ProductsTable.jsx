import React, { useState, useEffect } from "react";
import { client as supabase } from "../supabase/Client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Product from "./Product";
import EditProduct from "./EditProduct";
import "../CSS/ProductsTable.css"; // Importa tu CSS aquí

const ProductsTable = () => {
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("Productos")
        .select("Codigo, Nombre, Precio");

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProductos(data);
      }
    };

    fetchProductos();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setOpen(true);
  };

  const handleEditProduct = (producto) => {
    setEditingProduct(producto);
    setOpen(true);
  };

  const handleDeleteProduct = async (codigo) => {
    try {
      const { data, error } = await supabase
        .from("Productos")
        .delete()
        .eq("Codigo", codigo);

      if (error) {
        console.error("Error al eliminar el producto:", error);
        return;
      }

      console.log("Producto eliminado:", data);
      setProductos(productos.filter((producto) => producto.Codigo !== codigo));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} className="products-table-container">
        <Table className="products-table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Código</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Precio</TableCell>
              <TableCell align="center">Acciones</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddProduct}
                  className="products-add-btn"
                >
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.Codigo}>
                <TableCell align="center">{producto.Codigo}</TableCell>
                <TableCell align="center">{producto.Nombre}</TableCell>
                <TableCell align="center">{producto.Precio}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleEditProduct(producto)}
                    className="products-edit-btn"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProduct(producto.Codigo)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editingProduct ? (
        <EditProduct
          open={open}
          handleClose={handleClose}
          initialProduct={editingProduct}
        />
      ) : (
        <Product open={open} handleClose={handleClose} />
      )}
    </>
  );
};

export default ProductsTable;
