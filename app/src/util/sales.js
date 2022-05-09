

export function getSaleOptions(entities) {
    let sales = entities.filter(e => e.name === "Sales")[0].data
    let options = []
    sales.forEach(s => {
        options.push({value: s.id, label: `Sale ${s.id} on ${s.date}`, ...s})
    })
    return options
}

export function getCustomerSales(entities, customerID) {
    let saleHasCust = entities.filter(e => e.name === "Sales_has_Customers")[0].data
    let customer_sale_ids = saleHasCust.filter(rec => rec.customer_id === customerID).map(s => s.sale_id)
    let sales = entities.filter(e => e.name === "Sales")[0].data
    let customer_sales = sales.filter(c => customer_sale_ids.includes(c.id))
    let edit_values = []
    customer_sales.forEach(s => {
        edit_values.push({value: s.id, label: `Sale ${s.id} on ${s.date}`, ...s})
    })
    return edit_values
}