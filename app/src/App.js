import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
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
    {name: "Models", columns: ["id", "manufacturer", "model", "model_year",	"generation",	"body_style_code"]},
    {name: "Customers", columns: ["id", "first_name",	"last_name", "street", "apartment",	"city",	"state", "zip", "telephone", "email", "created_date"]},
    {name: "Employees", columns: ["id",	"location_id", "type", "first_name", "last_name",	"work_telephone",	"work_email",	"hire_date", "termination_date"]},
    {name: "Vehicles", columns: ["id",	"location_id", "model_id",	"vin",	"color",	"trim",	"mileage",	"is_used",	"date_acquired",	"price_paid",	"msrp"]},
    {name: "Sales", columns: ["id", "employee_id", "vehicle_id", "location_id",	"date",	"purchase_price"]},
    {name: "Locations", columns: ["id",	"code", "street",	"city",	"state", "zip", "telephone"]}
  ]

  return (
    <div className="App">
        <Navigation entities={entities}></Navigation>
        <header>
          <h1>JD2 Motors Database Admin</h1>
          <p>
            This app lets you add, remove and update data.
          </p>
        </header>
        <main>
          <BrowserRouter>
            <Routes>
              {entities.map((e, i) => 
                <Route key={i} path={`/${e.name.toLowerCase()}`} element={
                  <ViewTablePage entity={e} setRecordToEdit={setRecordToEdit} recordToDelete={recordToDelete} setRecordToDelete={setRecordToDelete} />
                } 
                />
              )}
            </Routes>
          </BrowserRouter>
        </main>
        <footer>
          © 2022 Joseph Doiron
        </footer>
    </div>
  )
}

export default App;
