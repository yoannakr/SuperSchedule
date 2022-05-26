import React, { useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import { CreatePosition } from "./features/Position";
import { CreateLocation } from "./features/Location";
import { CreateShiftType } from "./features/ShiftType";
import { CreateEmployee, LeavesAndSickLeave } from "./features/Employee";
import { Sidebar } from "./components/Sidebar";
import { Setting } from "./features/Setting/";
import { Schedule } from "./features/Schedule/components/Schedule";
import { CreateSchedule } from "./features/Schedule/components/CreateSchedule";
import { PersonalSchedulesList } from "./features/Schedule/components/PersonalSchedulesList";
import { CreateUser } from "./features/User/components/CreateUser/CreateUser";
import { Login } from "./features/Login/components/Login";

function App() {
  let navigate = useNavigate();

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const onSuccessfulLogin = (isAdmin: boolean) => {
    navigate("/schedule");
    setIsLogin(true);
    setIsAdmin(isAdmin);
  };

  const onExit = () => {
    navigate("/");
    setIsLogin(false);
    setIsAdmin(false);
  };

  return (
    <div className="App">
      {isLogin && <Sidebar onExit={onExit} isAdmin={isAdmin} />}
      <Routes>
        <Route
          path="/"
          element={
            <Login
              onSuccessfulLogin={(isAdminInput: boolean) =>
                onSuccessfulLogin(isAdminInput)
              }
            />
          }
        />
        <Route path="/createSchedule" element={<CreateSchedule />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/createShiftType" element={<CreateShiftType />} />
        <Route path="/createLocation" element={<CreateLocation />} />
        <Route path="/createPosition" element={<CreatePosition />} />
        <Route path="/createEmployee" element={<CreateEmployee />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/leavesAndSickLeave" element={<LeavesAndSickLeave />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/personalSchedules" element={<PersonalSchedulesList />} />
      </Routes>
    </div>
  );
}

export default App;
