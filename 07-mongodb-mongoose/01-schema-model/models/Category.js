const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: 'Поле уникальное',
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: 'Поле уникальное',
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
