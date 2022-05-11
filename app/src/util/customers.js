
export async function getCustomerOptions() {
    let resp = await fetch('http://flip1.engr.oregonstate.edu:39182/Customers')
    let customers = (await resp.json()).data
    let options = []
    customers.forEach(c => {
        options.push({value: c.id, label: c.first_name + " " + c.last_name, ...c})
    })
    return options
}

// NOTE: this will hit the database in production
export async function getSaleCustomers(saleID) {
    let resp = await fetch('http://flip1.engr.oregonstate.edu:39182/Sales_has_Customers')
    let saleHasCust = (await resp.json()).data
    resp = await fetch('http://flip1.engr.oregonstate.edu:39182/Customers')
    let customers = (await resp.json()).data
    let sale_customer_ids = saleHasCust.filter(rec => rec.sale_id === saleID).map(s => s.customer_id)
    let sale_customers = customers.filter(c => sale_customer_ids.includes(c.id))
    let edit_values = []
    sale_customers.forEach(c => {
        edit_values.push({value: c.id, label: c.first_name + " " + c.last_name, ...c})
    })
    return edit_values
}