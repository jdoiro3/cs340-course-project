# TODO

## Discussion

I thought this might be a good place to keep a running list of changes we plan to make (to comply with a rubric or the Project Guide, for example). I kept finding little things as we were preparing the Step 3 draft, but they weren’t critical to fix at the time.

- From the CS340 Project Guide: “In a one-to-many relationship, you should be able to set the foreign key value to NULL, that removes the relationship. In case none of the one-to-many relationships in your database has partial participation, you would need to change that to make sure they can have NULL values.”
I suggest allowing the 1:M relationship between Locations and Vehicles to be nullable. Specifically, a vehicle could have a null location when it is first acquired from the manufacturer and before it reaches a dealership location. Also, a vehicle could have a null location after it is sold.
- Related to the nullability of foreign keys, I added some CASCADE operations a little while back, and I wasn’t sure if we wanted to expand or revise them.
    - Currently, deleting a Customer or Sale will delete corresponding entries in Sales_has_Customers. Updating a Customer or Sale primary key will update the foreign keys in Sales_has_Customers. I don’t think any changes are needed here.
    - Updating a Location primary key will update the foreign key in Employees. Deleting a Location will not delete the corresponding Employees. I think not deleting Employees makes sense. However, this means that you can’t delete a Location if there are Employees tied to it. This might be fine. Alternatively, we could allow the Location foreign key to be null in Employees when a Location is deleted. Any preference?
        - I took the same approach to the Location and Model foreign keys in Vehicles. That is, updates cascade, and delete does nothing. Ditto for the foreign keys in Sales. (But note the proposal above for allowing location_id in Vehicles to be null to enable partial participation, as required by the Project Guide.)
- From the Project Guide: “One exception is oftentimes it works better for the UX to have a single web page for a Many-to-Many relationship between 2 tables (so the user doesn't have to view two pages to complete a transaction in both tables).” From Project Step 3 Review: “Does each INSERT also add the corresponding FK attributes, including at least one M:M relationship? In other words if there is a M:M relationship between Orders and Products, INSERTing a new Order (e.g. orderID, customerID, date, total), should also INSERT row(s) in the intersection table, e.g. OrderDetails (orderID, productID, qty, price and line_total).” From the Project Guide: “It should be possible to INSERT entries into every table individually.”
    - It’s a little hard to know what to do here because there’s some tension between these different requirements. It sounds like we’ll need to enable a user to select one or more Customers when adding a Sale so that appropriate records can automatically be added to Sales_has_Customers in the backend. Despite this, because we need to provide INSERT capabilities for every table, it seems like we’ll need to allow directly inserting into Sales_has_Customers (note that this is already present in our current frontend). I wasn’t sure if we’d want to move Sales_has_Customers to the Sales page?
- On the topic of Sales_has_Customers, I think we’ll want to incorporate JOINs into some of our SELECT queries to make the tables more readable. For example, Sales_has_Customers could display the date of the Sale, the Customer’s first and last name, and the color and model name of the Vehicle (or maybe just the Customer’s first and last name if Sales_has_Customers is on the same page as Sales). I did something like this already for the queries for the dropdown menus.
    - Note that the rubric for Project Step 3 Final Version includes “1) DML.SQL file has SELECT, INSERT, UPDATE and DELETE queries to meet CS340 Project Guide, 2) JOINs used to make FKs user friendly”. This might just be in the context of the dropdown menus, but it wouldn’t be difficult for me to craft appropriate SQL queries. Given that our tables are kinda auto-generated, I thought the frontend implementation might also be straightforward.