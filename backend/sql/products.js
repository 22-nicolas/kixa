import pool from "./db.js"

export async function getProductData () {
    const [data] = await pool.query("select * from products"); 
    return data;
}

export async function getProductById(id) {
    const [product] = await pool.query(`
    select * 
    from products
    where id = ?
    `, [id]);
    return product[0];
}

export async function createProductData(product) {
    let {key, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway} = product;
    colors = '[' + colors.toString() + ']'
    sizes = '[' + sizes.toString() + ']'
    imgs_per_colorway = '[' + imgs_per_colorway.toString() + ']'
    await pool.query(`
        insert into products (id, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [key, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway]);

    const result = await getProductById(key);
    return result;
}

export async function deleteProductData(id) {
    await pool.query(`
        delete from products
        where id = ? 
    `, [id])
}

export async function getProductStock(productId, variant, size) {
    let stock
    if (!isNaN(variant) && !isNaN(size)) {
        [[stock]] = await pool.query(`
            select * 
            from stock
            where product_id = ? and variant = ? and size = ?
        `, [productId, variant, size]);
    } else {
        [stock] = await pool.query(`
            select * 
            from stock
            where product_id = ?
        `, [productId]);
    }

    return stock;
}