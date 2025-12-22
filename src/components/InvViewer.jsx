import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { client as supabase } from "../supabase/Client";

const fetchProductos = async (setProductos) => {
  const { data, error } = await supabase
    .from("Productos")
    .select("Codigo, Nombre, Precio, Unidades");

  if (error) {
    console.error("Error al obtener los productos:", error);
  } else {
    console.log("Productos obtenidos:", data); // Verifica los datos obtenidos
    setProductos(data);
  }
};

const InvViewer = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos(setProductos);
  }, []);

  return (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Código</TableCell>
            <TableCell align="center">Nombre</TableCell>
            <TableCell align="center">Precio</TableCell>
            <TableCell align="center">Unidades</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="table-empty-state">
                  <div className="table-empty-state-icon">📦</div>
                  <div className="table-empty-state-text">No hay productos disponibles</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            productos.map((producto) => (
              <TableRow key={producto.Codigo}>
                <TableCell align="center">{producto.Codigo}</TableCell>
                <TableCell align="center">{producto.Nombre}</TableCell>
                <TableCell align="center">${producto.Precio}</TableCell>
                <TableCell align="center">{producto.Unidades}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvViewer;
