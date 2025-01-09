import React, { useState, useEffect } from 'react';
import { client as supabase } from '../supabase/Client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const ProductsTable = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            const { data, error } = await supabase
                .from('Productos')
                .select('Codigo, Nombre, Precio');

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProductos(data);
            }
        };

        fetchProductos();
    }, []);

    const handleAddProduct = (producto) => {
        console.log('Agregar producto:', producto);
        // Lógica para agregar el producto
    };

    const handleEditProduct = (producto) => {
        console.log('Editar producto:', producto);
        // Lógica para editar el producto
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productos.map((producto) => (
                        <TableRow key={producto.Codigo}>
                            <TableCell>{producto.Codigo}</TableCell>
                            <TableCell>{producto.Nombre}</TableCell>
                            <TableCell>{producto.Precio}</TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={() => handleAddProduct(producto)}
                                    sx={{ marginRight: 1 }}
                                >
                                    Agregar
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="warning" 
                                    onClick={() => handleEditProduct(producto)}
                                    sx={{ marginLeft: 1 }}
                                >
                                    Editar                                                  
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ProductsTable;
