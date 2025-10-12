import { VercelRequest, VercelResponse } from '@vercel/node';

// Importar la app de manera segura
let app: any;
try {
  app = require('../src').app;
} catch (error) {
  console.error('Error al importar la app:', error);
  
  // Crear una app de emergencia si hay problemas
  const express = require('express');
  app = express();
  
  app.get('/api/health', (req: any, res: any) => {
    res.json({ status: 'emergency-mode', error: 'App principal falló al cargar' });
  });
  
  app.use('*', (req: any, res: any) => {
    res.status(500).json({ error: 'App en modo de emergencia', details: error?.message });
  });
}

export default app;