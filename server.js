// Install Express: npm install --no-save --package-lock=false express
// Start the app: node server.js
const express = require('express');
const path = require('node:path');
const app = express();

app.disable('x-powered-by');

// Edit this list to change the menu. Prices are in Philippine pesos.
const foods = [
  { id: 1, food: 'Chicken Adobo', price: 120 },
  { id: 2, food: 'Pork Sinigang', price: 140 },
  { id: 3, food: 'Fried Chicken', price: 100 },
  { id: 4, food: 'Pancit Canton', price: 85 },
  { id: 5, food: 'Vegetable Lumpia', price: 60 },
];

app.use((request, response, next) => {
  response.set('Cache-Control', 'no-store');
  if (request.method !== 'GET') {
    response.set('Allow', 'GET');
    return response.status(405).json({ error: 'Only GET requests are supported.' });
  }
  next();
});

app.get(['/', '/index.html'], (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// GET /api/foods returns the entire menu.
app.get('/api/foods', (request, response) => {
  response.json(foods);
});

// GET /api/foods/2 returns the food with ID 2.
app.get('/api/foods/:id', (request, response) => {
  const idText = request.params.id;
  const id = Number(idText);
  if (!/^[0-9]+$/.test(idText) || !Number.isSafeInteger(id) || id < 1) {
    return response.status(400).json({ error: 'Enter a positive whole number for the food ID.' });
  }

  const food = foods.find((item) => item.id === id);
  if (!food) {
    return response.status(404).json({ error: `No food found with ID ${id}.` });
  }
  response.json(food);
});

app.use((request, response) => {
  response.status(404).json({ error: 'Page or API route not found.' });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Food menu: http://localhost:${port}`);
  console.log(`Menu API: http://localhost:${port}/api/foods`);
});

server.on('error', (error) => {
  console.error(`Could not start the server: ${error.message}`);
  process.exitCode = 1;
});
