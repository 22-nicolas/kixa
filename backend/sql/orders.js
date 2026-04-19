import pool from "./db.js";

export async function createOrder(order) {
    const { id, items } = order;
    await pool.query(`
        insert into orders (id, items)
        values (?, ?)
    `, [id, JSON.stringify(order.items)]);
}

export async function getOrderById(id) {
    const [order] = await pool.query(`
        select * 
        from orders
        where id = ?
    `, [id]);
    return order[0];
}

export async function updateOrderStatus(id, status) {
    await pool.query(`
        update orders
        set status = ?
        where id = ?
    `, [status, id])
}