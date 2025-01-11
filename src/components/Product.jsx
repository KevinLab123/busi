import React, { useState } from 'react';
import { Container, Box, Button, TextField } from '@mui/material';
import { client as supabase } from '../supabase/Client';

const Product = () => {
    const [producto, setProducto] = useState({
        precio: '',
        nombre: '',
        codigo: ''
    });

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

    const handleRegister = async () => {
        const { codigo, precio, nombre } = producto;
        if (!codigo || !precio || !nombre) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        try {
            console.log({ precio, nombre, codigo });

            // Insertar el producto en la base de datos
            const { data, error } = await supabase
                .from('Productos')
                .insert([
                    { Codigo: codigo, Nombre: nombre, Precio: precio }
                ]);

            if (error) {
                console.log('Error al agregar el producto:', error);
                throw error;
            }

            console.log('Producto agregado:', data);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}
        >
            <Box 
                sx={{ 
                    bgcolor: 'grey.300', 
                    padding: 4, 
                    borderRadius: 2, 
                    width: '50%' 
                }}
            >
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
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="large" 
                        onClick={handleRegister}
                    >
                        Registrarse
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Product;