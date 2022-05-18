import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CreatePosition } from "./features/Position";
import { CreateLocation } from "./features/Location";
import { CreateShiftType } from "./features/ShiftType";
import { CreateEmployee, LeavesAndSickLeave } from "./features/Employee";
import { Sidebar } from "./components/Sidebar";
import { Setting } from "./features/Setting/";
import { Schedule } from "./features/Schedule/components/Schedule";
import { CreateSchedule } from "./features/Schedule/components/CreateSchedule";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<CreatePosition />} />
          <Route path="/createSchedule" element={<CreateSchedule />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/createShiftType" element={<CreateShiftType />} />
          <Route path="/createLocation" element={<CreateLocation />} />
          <Route path="/createPosition" element={<CreatePosition />} />
          <Route path="/createEmployee" element={<CreateEmployee />} />
          <Route path="/settings" element={<Setting />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
