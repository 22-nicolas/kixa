import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config({ path: "backend/.env" });
//`mysql://root:lalqzvKOzgaXTAnxMJoniaSMviLQLlDY@centerbeam.proxy.rlwy.net:23674/railway`

/*
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
*/

const pool = mysql.createPool(`mysql://root:lalqzvKOzgaXTAnxMJoniaSMviLQLlDY@centerbeam.proxy.rlwy.net:23674/railway`).promise();


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
/*
const productData = await createProductData('test', 'test', 124, '[3,2]', 2, '[23,32]', null, 3, 'test', '[213,2]');
console.log(productData);
deleteProductData('test');
*/