import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { CreatePosition } from "./features/Position";
import { CreateLocation } from "./features/Location";
import { CreateShiftType } from "./features/ShiftType";
import { CreateEmployee } from "./features/Employee";

import { NavBar } from "./components/NavBar/index";
import { Sidebar } from "./components/Sidebar";
import { LocationSchedule } from "./features/Schedule/components/LocationSchedule";
import { Setting } from "./features/Setting/";
import { Schedule } from "./features/Schedule/components/Schedule";

function App() {
  return (
    <div className="App">
      {/* <NavBar /> */}
      <Sidebar />
      <Router>
        <Routes>
          <Route path="/" element={<LocationSchedule locationId={1} />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/shiftTypes" element={<CreateShiftType />} />
          <Route path="/locations" element={<CreateLocation />} />
          <Route path="/positions" element={<CreatePosition />} />
          <Route path="/employees" element={<CreateEmployee />} />
          <Route path="/settings" element={<Setting />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
