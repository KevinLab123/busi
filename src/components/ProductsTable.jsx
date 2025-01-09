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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Producto from './Producto';

const ProductsTable = () => {
    const [productos, setProductos] = useState([]);
    const [open, setOpen] = useState(false);

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

    const handleAddProduct = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEditProduct = (producto) => {
        console.log('Editar producto:', producto);
        // Lógica para editar el producto
    };

    return (
        <>
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
                                        onClick={handleAddProduct}
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: '50%', 
                        bgcolor: 'background.paper', 
                        border: '2px solid #000', 
                        boxShadow: 24, 
                        p: 4 ,
                        maxHeight: '80vh', // Limita la altura máxima para evitar tocar los bordes
                        overflowY: 'auto', // Permite el desplazamiento si el contenido es demasiado grande
                    }}
                >
                    <Producto />
                </Box>
            </Modal>
        </>
    );
}

export default ProductsTable;
