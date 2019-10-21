const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if (!Object.keys(ctx.query).length) return next();

  const products = await Products.find({$text: {$search: ctx.query.query}});

  ctx.body = {products};
};
