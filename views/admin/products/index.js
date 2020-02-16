const layout = require("../layout");

module.exports = ({ products }) => {
    const productList = products
        .map((product, id) => {
            return `<div key=${id}>
                    <h1>${product.title}</h1>
                    <h2>${product.price}</h2>
                </div>`;
        })
        .join("");

    return layout({
        content: `
        <h1 class = "title">Products</h1>
        ${productList}`
    });
};
