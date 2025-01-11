import React, { useState } from 'react';
import { Container, Box, Button, TextField } from '@mui/material';
import { client as supabase } from '../supabase/Client';

const EditProduct = () => {
    const [producto, setProducto] = useState({
        precio: '',
        nombre: '',
        codigo: ''
    });

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
        const{codigo,nombre ,precio} = producto;
        if(!codigo || !nombre || !precio){
            console.log('Todos los campos son obligatorios');
            return;
        }

        try{
            console.log({precio,nombre,codigo});

            //Actualizar producto
            const {data,error} = await supabase
            .from('Productos')
            //Comando para actualizar datos existentes
            .update({Nombre: nombre, Precio: precio})
            //En donde el codigo coincida con el codigo brindado
            //Columna a comparar , valor a comparar
            .eq('Codigo', codigo);
            console.log('Producto actulizado')
            
        } catch(error){
            console.error('Error al actualizar el producto:', error);
        };
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
                        name="codigo" // Asigna el nombre del campo
                        label="Código" 
                        variant="outlined" 
                        value={producto.codigo}
                        onChange={handleChange}
                    />
                    <TextField 
                        id="precio" 
                        name="precio" // Asigna el nombre del campo
                        label="Precio" 
                        variant="outlined" 
                        value={producto.precio}
                        onChange={handleChange}
                    />
                    <TextField 
                        id="nombre" 
                        name="nombre" // Asigna el nombre del campo
                        label="Nombre" 
                        variant="outlined" 
                        value={producto.nombre}
                        onChange={handleChange}
                    />
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="large" 
                        onClick={handleUpdate}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default EditProduct;