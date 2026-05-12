// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const app = express();
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

// ==========================================
// ROUTES
// ==========================================

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Auction Backend is running!' });
});

// --- ITEMS ROUTES ---

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create a new item
app.post('/api/items', async (req, res) => {
  try {
    const { itemNumber, title, description, amount, shop } = req.body;
    const newItem = await prisma.item.create({
      data: { itemNumber, title, description, amount: parseFloat(amount) || 0, shop }
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item. Item number might exist.' });
  }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemNumber, title, description, amount, shop } = req.body;
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { itemNumber, title, description, amount: parseFloat(amount) || 0, shop }
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update item.' });
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete item.' });
  }
});

// --- SALES ROUTES ---

// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Record a new sale
app.post('/api/sales', async (req, res) => {
  try {
    const { itemId, itemName, bidderName, wardName, paymentMethod, paymentDone, amount } = req.body;

    const newSale = await prisma.sale.create({
      data: {
        itemId: parseInt(itemId),
        itemName,
        bidderName,
        wardName,
        paymentMethod,
        paymentDone: Boolean(paymentDone),
        amount: parseFloat(amount) || 0
      }
    });

    res.status(201).json({ message: 'Sale recorded successfully', sale: newSale });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A sale for this item ID already exists.' });
    }
    res.status(500).json({ error: 'Internal server error while recording sale' });
  }
});

// Update a sale
app.put('/api/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, itemName, bidderName, wardName, paymentMethod, paymentDone, amount } = req.body;
    
    const updatedSale = await prisma.sale.update({
      where: { id: parseInt(id) },
      data: {
        itemId: parseInt(itemId),
        itemName,
        bidderName,
        wardName,
        paymentMethod,
        paymentDone: Boolean(paymentDone),
        amount: parseFloat(amount) || 0
      }
    });
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update sale.' });
  }
});

// Delete a sale
app.delete('/api/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sale.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete sale.' });
  }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Auction Server running on http://localhost:${PORT}`);
});