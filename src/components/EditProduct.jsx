import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { client as supabase } from '../supabase/Client';

const EditProduct = ({ open, handleClose, initialProduct }) => {
    const [producto, setProducto] = useState({
        precio: '',
        nombre: '',
        codigo: ''
    });

    useEffect(() => {
        if (initialProduct) {
            setProducto(initialProduct);
        }
    }, [initialProduct]);

    // Manejador de cambios para todos los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'precio' && isNaN(value)) {
            console.log('El precio debe ser un número');
            return;
        }
        // Actualiza el estado correspondiente usando el atributo name
        setProducto((prevProducto) => ({
            ...prevProducto,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        const { codigo, precio, nombre } = producto;
        if (!codigo || !precio || !nombre) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        try {
            console.log({ precio, nombre, codigo });

            // Actualizar el producto en la base de datos
            const { data, error } = await supabase
                .from('Productos')
                .update({ Nombre: nombre, Precio: precio })
                .eq('Codigo', codigo);

            if (error) {
                console.log('Error al actualizar el producto:', error);
                throw error;
            }

            console.log('Producto actualizado:', data);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Editar Producto</DialogTitle>
            <DialogContent>
                <Box 
                    component="form" 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2, 
                        width: '100%' 
                    }}
                >
                    <TextField 
                        id="codigo" 
                        name="codigo"
                        label="Código" 
                        variant="outlined" 
                        value={producto.codigo}
                        onChange={handleChange}
                    />
                    <TextField 
                        id="precio" 
                        name="precio"
                        label="Precio" 
                        variant="outlined" 
                        value={producto.precio}
                        onChange={handleChange}
                    />
                    <TextField 
                        id="nombre" 
                        name="nombre"
                        label="Nombre" 
                        variant="outlined" 
                        value={producto.nombre}
                        onChange={handleChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    size="large" 
                    onClick={handleUpdate}
                >
                    Actualizar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditProduct;