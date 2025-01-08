import React, { useState } from 'react';
import { Container, Box, Button, TextField } from '@mui/material';

const Producto = () => {
    const [producto, setProducto] = useState({
        precio: '',
        nombre: '',
        codigo: ''
    });

    const [codigo, setCodigo] = useState('');
    const [precio, setPrecio] = useState('');
    const [nombre, setNombre] = useState('');

    const actualizarProducto = (precio, nombre, codigo) => {
        setProducto({ precio, nombre, codigo });
    };

    const handleRegister = () => {
        if (!codigo || !precio || !nombre) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        try {
            actualizarProducto(precio, nombre, codigo);
            console.log({ precio, nombre, codigo });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const handlePrecioChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            setPrecio(value);
        } else {
            console.log('El precio debe ser un número');
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
                        label="Código" 
                        variant="outlined" 
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    <TextField 
                        id="precio" 
                        label="Precio" 
                        variant="outlined" 
                        value={precio}
                        onChange={handlePrecioChange}
                    />
                    <TextField 
                        id="nombre" 
                        label="Nombre" 
                        variant="outlined" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="large" 
                        onClick={handleRegister}
                    >
                        Agregar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Producto;