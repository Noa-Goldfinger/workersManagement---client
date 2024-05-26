import './App.css';
import TableCustomized from '../src/components/employeesList'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SetEmployees from "./service/setEmployees";
import SetPositions from "./service/setPositions"
import { Route, Routes } from "react-router-dom";
import HomePage from './components/homePage/homePage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetEmployees());
    dispatch(SetPositions());
  }, []);
  return(
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employees" element={<TableCustomized />} />
      </Routes>
    </div>
    );
}

export default App;

