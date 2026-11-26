// Menjalankan aplikasi di komputer sendiri: halaman dari public/ + API.
import express from 'express';
import { app } from './server/app.js';

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Buka http://localhost:${port}`);
});
