import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { client as supabase } from '../supabase/Client';

// Datos a capturar
let cantidad = 0;
let Descripcion = '';
let fecha = '';

let producto = {
    Codigo: 0,
    Nombre: '',
    Precio: 0,
    Unidades: 0
};

// Función para buscar un producto por su código y almacenar la información
const handleCodeSearch = async (codigo) => {
    try {
        const { data, error } = await supabase
            .from('Productos')
            .select('Codigo, Nombre, Precio, Unidades')
            .eq('Codigo', codigo)
            .single();

        if (error) {
            console.error('Error al obtener el producto:', error);
            return;
        }

        producto = {
            Codigo: data.Codigo,
            Nombre: data.Nombre,
            Precio: data.Precio,
            Unidades: data.Unidades // Asegúrate de que este campo se selecciona correctamente
        };

        console.log('Producto obtenido:', producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
    }
};

const sumEvent = async (unidades) => {
    try {
        producto.Unidades += unidades;
        const { data, error } = await supabase
        .from('Productos')
        .update({ Unidades: producto.Unidades })
        .eq('Codigo', producto.Codigo);
        console.log('Producto actualizado:', producto);
    }catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
    
};

const InvMovements = () => {
    const [codigo, setCodigo] = useState('');
    const [unidades, setUnidades] = useState('');

    const handleChange = (e) => {
        setCodigo(e.target.value);
    };

    const handleUnidadesChange = (e) => {
        const value = e.target.value;
        if (isNaN(value)) {
            console.log('Solo se admiten números');
            return;
        }
        setUnidades(value);
    };

    const handleSubmit = async () => {
        await handleCodeSearch(codigo);
        sumEvent(Number(unidades));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="div" gutterBottom>
                    Movimiento de Inventario
                </Typography>
                <TextField
                    id="codigo"
                    name="codigo"
                    label="Código del Producto"
                    variant="outlined"
                    value={codigo}
                    onChange={handleChange}
                />
                <TextField
                    id="unidades"
                    name="unidades"
                    label="Unidades"
                    variant="outlined"
                    value={unidades}
                    onChange={handleUnidadesChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Obtener Producto
                </Button>
            </Box>
        </Container>
    );
};

export default InvMovements;