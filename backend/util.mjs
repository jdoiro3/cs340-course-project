

export async function executeQuery(conn_pool, sql) {
    try {
        let result = await conn_pool.query(sql)
        return result
    } catch (error) {
        throw `MySQL Error: ${error}`
    }
}