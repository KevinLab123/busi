import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { client as supabase } from "../supabase/Client";

const fetchMovimientos = async (setMovimientos) => {
  const { data, error } = await supabase
    .from("MovInventario")
    .select("Codigo, Usuario, Fecha, TipoMov, ProductAfectado, Unidades");

  if (error) {
    console.error("Error al obtener los movimientos:", error);
  } else {
    console.log("Movimientos obtenidos:", data); // Verifica los datos obtenidos
    setMovimientos(data);
  }
};

const MovViewer = () => {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    fetchMovimientos(setMovimientos);
  }, []);

  return (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Usuario</TableCell>
            <TableCell align="center">Fecha</TableCell>
            <TableCell align="center">Tipo De Movimiento</TableCell>
            <TableCell align="center">Producto Afectado</TableCell>
            <TableCell align="center">Unidades</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movimientos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="table-empty-state">
                  <div className="table-empty-state-icon">📊</div>
                  <div className="table-empty-state-text">No hay movimientos registrados</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            movimientos.map((movimiento, index) => (
              <TableRow key={movimiento.Codigo || index}>
                <TableCell align="center">{movimiento.Usuario}</TableCell>
                <TableCell align="center">{movimiento.Fecha}</TableCell>
                <TableCell align="center">{movimiento.TipoMov}</TableCell>
                <TableCell align="center">{movimiento.ProductAfectado}</TableCell>
                <TableCell align="center">{movimiento.Unidades}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MovViewer;
