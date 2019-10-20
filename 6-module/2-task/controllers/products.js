const Product = require('../models/Product');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const formatProduct = (product = {}) => ({
  id: product.id,
  title: product.title,
  images: product.images,
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  description: product.description,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const products = await Product.find({subcategory: ctx.query.subcategory});

  if (!products.length) {
    ctx.status = 200;
    ctx.body = {products};
    return;
  }

  ctx.products = products;
  next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = ctx.products.map((product) => formatProduct(product));

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  if (!ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = 'id is invalid';
    return;
  }

  const product = await Product.findOne({_id: ctx.params.id});


  if (!product) {
    ctx.status = 404;
    ctx.body = 'products not exist';
    return;
  }

  ctx.body = {product: formatProduct(product)};
};

