
// NOTE: in production this will query the customers table and returns the customers as an array of objects.
// once we have the customers in an array of objects, we add a few more attributes for the select form component
export function getCustomerOptions(entities) {
    let customers = entities.filter(e => e.name === "Customers")[0].data
    customers.forEach(c => {
        c.value = c.id
        c.label = c.first_name + " " + c.last_name
    })
    return customers
}

// NOTE: this will hit the database in production
export function getSaleCustomers(entities, saleID) {
    let saleHasCust = entities.filter(e => e.name === "Sales_has_Customers")[0].data
    let sale_customer_ids = saleHasCust.filter(rec => rec.sale_id === saleID).map(s => s.customer_id)
    let customers = entities.filter(e => e.name === "Customers")[0].data
    let sale_customers = customers.filter(c => sale_customer_ids.includes(c.id))
    sale_customers.forEach(c => {
        c.value = c.id
        c.label = c.first_name + " " + c.last_name
    })
    return sale_customers
}