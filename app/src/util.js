function isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    let date = new Date(str)
    return date.toISOString() === str
  }

export function formatValue(value) {
    if (isIsoDate(value)) {
        return value.split("T")[0]
    } else {
        return value
    }
}


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