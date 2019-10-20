const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();

  const result = categories.map((category) => (
    {
      id: category.id,
      title: category.title,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        title: subcategory.title,
      })),
    })
  );

  ctx.body = {categories: result};
};
