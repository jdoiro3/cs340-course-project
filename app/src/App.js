import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom"
import ViewTablePage from './pages/ViewTablePage'
import HomePage from './pages/HomePage'
import Navigation from './components/Navigation'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './pages/common.css'
import entities from './util/temp-data'

function App() {

  const [recordToDelete, setRecordToDelete] = useState([])

  return (
    <div className="App">
      <HashRouter basename="/">
        <Navigation entities={entities}></Navigation>
        <header>
          <h1>JD2 Motors Database Admin</h1>
          <p>This app lets you add, remove, and update data.</p>
        </header>
        <Routes>
          {entities.map((e, i) => 
            <Route exact 
              key={i} 
              path={`/${e.name.toLowerCase()}`} 
              element={
                <ViewTablePage entity={e} recordToDelete={recordToDelete} setRecordToDelete={setRecordToDelete} />
                } 
            />
          )}
          <Route key={entities.length+1} path="/" element={<HomePage entities={entities}></HomePage>}></Route>
        </Routes>
      </HashRouter>
      <footer>
        © 2022 Joseph Doiron & John DeRusso
      </footer>
    </div>
  )
}

export default App
