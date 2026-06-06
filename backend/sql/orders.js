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

export async function createOrderId() {
    let id = Math.random().toString(36).substring(2, 10).toLocaleUpperCase();
    const order = await getOrderById(id);
    if (order) {
        return createOrderId();
    } else {
        return id;
    }
}