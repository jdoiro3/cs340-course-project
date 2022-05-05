import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom"
import ViewTablePage from './pages/ViewTablePage'
import AddExercisePage from './pages/AddExercisePage'
import EditExercisePage from './pages/EditExercisePage'
import Navigation from './components/Navigation'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [recordToEdit, setRecordToEdit] = useState([])
  const [recordToDelete, setRecordToDelete] = useState([])

  const entities = [
    {
      name: "Models", 
      columns: ["id", "manufacturer", "model", "model_year",	"generation",	"body_style_code"],
      data: [
        {id: 1, manufacturer: "Ford", model: "Mustang", model_year: 2019, generation: 2,	body_style_code: "CPE"},
        {id: 2, manufacturer: "Ford", model: "Explorer",	model_year: 2021, generation: 3, body_style_code: "SUV"},
        {id: 3, manufacturer: "Ford", model: "Puma",	model_year: 2019,	generation: 3, body_style_code: "CPE"},
        {id: 4, manufacturer: "Ford", model: "Bronco",	model_year: 2022, generation: 3, body_style_code: "SUV"},
        {id: 5, manufacturer: "Toyota", model: "4Runner", model_year: 2021, generation: 4, body_style_code: "SUV"},
      ]
    },
    {
      name: "Customers", 
      columns: ["id", "first_name",	"last_name", "street", "apartment",	"city",	"state", "zip", "telephone", "email", "created_date"],
      data: [
        {id: 1,	first_name: "Ashley", last_name: "O'Connor", street: "34 Barton St", apartment: "", city: "Knoxville", state:	"TN", zip: 37914, telephone: 8654978867,	email: "aoc@gmail.com", created_date:	"2019-03-16"},
        {id: 2,	first_name: "John", last_name: "Shoemaker", street: "48 Washington Ave", apartment: "", city: "Knoxville", state:	"TN", zip: 37902, telephone: 8655673636,	email: "john.shoemaker@uspto.gov", created_date:	"2020-10-04"},
        {id: 3,	first_name: "Chad", last_name: "Smith", street: "120 Main St", apartment: "Apt 303", city: "Knoxville", state:	"TN", zip: 37919, telephone: 8659267475,	email: "csmith@live.com", created_date:	"2021-07-28"},
        {id: 4,	first_name: "William", last_name: "Thompson", street: "17 Maple Ridge Ln", apartment: "", city: "Chattanooga", state:	"TN", zip: 37341, telephone: 4235768603,	email: "william.thompson@gmail.com", created_date:	"2022-04-23"},
        {id: 5,	first_name: "Amanda", last_name: "Thompson", street: "17 Maple Ridge Ln", apartment: "", city: "Chattanooga", state:	"TN", zip: 37341, telephone: 4236973215,	email: "amanda.thompson@gmail.com", created_date:	"2022-04-23"}
      ]
    },
    {
      name: "Employees", 
      columns: ["id",	"location_id", "type", "first_name", "last_name",	"work_telephone",	"work_email",	"hire_date", "termination_date"],
      data: [
        {id: 1,	location_id: 1,	type: "SALES", first_name: "Joseph", last_name: "Doiron",	work_telephone: 9852272752, work_email: "joe@jdmotors.com", hire_date: "2021-12-31", termination_date: "9999-12-31"},
        {id: 2,	location_id: 1,	type: "SALES", first_name: "Bill",	last_name: "Roger",	work_telephone: 9856658141,	work_email: "bill@jdmotors.com", hire_date: "2022-04-28",	termination_date: "9999-12-31"},
        {id: 3,	location_id: 1,	type: "SALES", first_name: "John",	last_name: "DeRusso",	work_telephone: 9856658141,	work_email: "john@jdmotors.com", hire_date: "2022-04-29",	termination_date: "9999-12-31"},
        {id: 4,	location_id: 2,	type: "SALES", first_name: "Elon",	last_name: "Musk",	work_telephone: 5047220112,	work_email: "elon@jdmotors.com", hire_date: "2022-04-27",	termination_date: "9999-12-31"},
        {id: 5,	location_id: 2,	type: "MANAGR",	first_name: "Bill",	last_name: "Gates",	work_telephone: 9852348521,	work_email: "bill@jdmotors.com", hire_date: "2022-05-01",	termination_date: "9999-12-31"}
      ]
    },
    {
      name: "Vehicles", 
      columns: ["id",	"location_id", "model_id",	"vin",	"color",	"trim",	"mileage",	"is_used",	"date_acquired",	"price_paid",	"msrp"],
      data: [
        {id: 1,	location_id: 1,	model_id: 1, vin: 701787041, color: "Black", trim: "Ecoboost Premium", mileage: 38,	is_used: 0,	date_acquired: "2019-03-09", price_paid: 27225.00, msrp: 32225.00},
        {id: 2,	location_id: 1,	model_id: 1, vin: 692589118, color: "Red", trim: "GT", mileage: 6812,	is_used: 1,	date_acquired: "2020-09-14", price_paid: 29500.00, msrp: 37275.00},
        {id: 3,	location_id: 1,	model_id: 2, vin: 676321704, color: "White", trim: "Limited", mileage: 27, is_used: 0,	date_acquired: "2021-07-21", price_paid: 41555.00, msrp: 46555.00},
        {id: 4,	location_id: 2,	model_id: 4, vin: 624236745, color: "Blue", trim: "Outer Banks", mileage: 40,	is_used: 0,	date_acquired: "2022-04-20", price_paid: 37950.00, msrp: 42950.00},
        {id: 5,	location_id: 2,	model_id: 5, vin: 776559754, color: "Black", trim: "TRD Sport", mileage: 13157,	is_used: 1, date_acquired: "2022-04-26", price_paid: 26500.00, msrp: 40450.00},
        {id: 6,	location_id: 1,	model_id: 2, vin: 693335956, color: "Blue",	trim: "Limited", mileage: 10189, is_used: 1, date_acquired: "2022-01-04",	price_paid: 31750.00,	msrp: 46555.00}
      ]
    },
    {
      name: "Sales", 
      columns: ["id", "employee_id", "vehicle_id", "location_id",	"date",	"purchase_price"],
      data: [
        {id: 1,	employee_id: 1,	vehicle_id: 1, location_id: 1, date: "2019-03-16",	purchase_price: 29500.00},
        {id: 2,	employee_id: 3,	vehicle_id: 2, location_id: 1, date: "2020-10-04", purchase_price: 31000.00},
        {id: 3,	employee_id: 1,	vehicle_id: 3, location_id: 1, date: "2021-07-28",	purchase_price: 44750.00},
        {id: 4,	employee_id: 1,	vehicle_id: 6, location_id: 1, date: "2022-03-10",	purchase_price: 33000.00},
        {id: 5,	employee_id: 5,	vehicle_id: 4, location_id: 2, date: "2022-04-23",	purchase_price: 43000.00},
      ]
    },
    {
      name: "Locations", 
      columns: ["id",	"code", "street",	"city",	"state", "zip", "telephone"],
      data: [
        {id: 1,	code: "TN001",	street: "210 12th Street",	city: "Knoxville", state: "TN", zip: 37901, telephone:	8658874532},
        {id: 2,	code: "TN002",	street: "803 Liberty", city: "Chattanooga", state: "TN", zip:	37402, telephone: 4238864365}
      ]
    }
  ]

  return (
    <div className="App">
      <HashRouter basename="/">
        <Navigation entities={entities}></Navigation>
        <header>
          <h1>JD2 Motors Database Admin</h1>
          <p>
          This app lets you add, remove, and update data.
          </p>
        </header>
        <Routes>
          {entities.map((e, i) => 
            <Route exact key={i} path={`/${e.name.toLowerCase()}`} element={
                <ViewTablePage key={document.location.href} entity={e} recordToEdit={recordToEdit} setRecordToEdit={setRecordToEdit} recordToDelete={recordToDelete} setRecordToDelete={setRecordToDelete} />
                } 
            />
          )}
        </Routes>
      </HashRouter>
      <footer>
        © 2022 Joseph Doiron & John DeRusso
      </footer>
    </div>
  )
}

export default App;
