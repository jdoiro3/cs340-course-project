import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom"
import ViewTablePage from './pages/ViewTablePage'
import HomePage from './pages/HomePage'
import Navigation from './components/Navigation'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './pages/common.css'
import entities from './util/temp-data'

function App() {

  const [recordToDelete, setRecordToDelete] = useState([])
  const [tables, setTableNames] = useState([])

  async function getTableNames() {
    let resp = await fetch('http://flip1.engr.oregonstate.edu:39182/tables', {mode: 'cors'})
    let tables = await resp.json()
    setTableNames(tables)
  }

  useEffect(() => {
    getTableNames()
  }, [])

  return (
    <div className="App">
      <HashRouter basename="/">
        <Navigation tables={tables}></Navigation>
        <header>
          <p>This app lets you add, remove, and update data.</p>
        </header>
        <Routes>
          {tables.map((t, i) => 
            <Route exact 
              key={i} 
              path={`/${t}`} 
              element={
                <ViewTablePage entityName={t} recordToDelete={recordToDelete} setRecordToDelete={setRecordToDelete} />
                } 
            />
          )}
          <Route key={entities.length+1} path="/" element={<HomePage></HomePage>}></Route>
        </Routes>
      </HashRouter>
      <footer>
        © 2022 Joseph Doiron & John DeRusso
      </footer>
    </div>
  )
}

export default App
