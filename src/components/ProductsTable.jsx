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
import Product from './Product'; // Asegúrate de que el archivo Product.jsx existe
import EditProduct from './EditProduct';

const ProductsTable = () => {
    // Estado para almacenar la lista de productos
    const [productos, setProductos] = useState([]);
    // Estado para controlar la visibilidad del modal
    const [open, setOpen] = useState(false);
    // Estado para almacenar el producto que se está editando
    const [editingProduct, setEditingProduct] = useState(null);

    // useEffect para obtener los productos de la base de datos cuando el componente se monta
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

    // Función para manejar la acción de agregar un producto
    const handleAddProduct = () => {
        setEditingProduct(null); // No se está editando ningún producto
        setOpen(true); // Abre el modal
    };

    // Función para manejar la acción de editar un producto
    const handleEditProduct = (producto) => {
        setEditingProduct(producto); // Establece el producto que se está editando
        setOpen(true); // Abre el modal
    };

    // Función para manejar la acción de eliminar un producto
    const handleDeleteProduct = async (codigo) => {
        try {
            const { data, error } = await supabase
                .from('Productos')
                .delete()
                .eq('Codigo', codigo);

            if (error) {
                console.error('Error al eliminar el producto:', error);
                return;
            }

            console.log('Producto eliminado:', data);
            // Actualizar la lista de productos después de eliminar
            setProductos(productos.filter(producto => producto.Codigo !== codigo));
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Contenedor de la tabla */}
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
                                    {/* Botón para agregar un producto */}
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        onClick={handleAddProduct}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Agregar
                                    </Button>
                                    {/* Botón para editar un producto */}
                                    <Button 
                                        variant="contained" 
                                        color="warning" 
                                        onClick={() => handleEditProduct(producto)}
                                        sx={{ marginLeft: 1, marginRight: 1 }}
                                    >
                                        Editar
                                    </Button>
                                    {/* Botón para eliminar un producto */}
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
            {/* Modal para agregar o editar un producto */}
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
                        maxHeight: '80vh', // Limita la altura máxima para evitar tocar los bordes
                        overflowY: 'auto', // Permite el desplazamiento si el contenido es demasiado grande
                        bgcolor: 'background.paper', 
                        border: '2px solid #000', 
                        boxShadow: 24, 
                        p: 4 
                    }}
                >
                    {editingProduct ? (
                        <EditProduct initialProduct={editingProduct} />
                    ) : (
                        <Product />
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default ProductsTable;
