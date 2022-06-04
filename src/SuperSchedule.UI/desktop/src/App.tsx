import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import { CreatePosition } from "./features/Position";
import { CreateLocation } from "./features/Location";
import { CreateShiftType } from "./features/ShiftType";
import {
  CreateEmployee,
  EmployeeList,
  LeavesAndSickLeave,
} from "./features/Employee";
import { Sidebar } from "./components/Sidebar";
import { Setting } from "./features/Setting/";
import { Schedule } from "./features/Schedule/components/Schedule";
import { CreateSchedule } from "./features/Schedule/components/CreateSchedule";
import { PersonalSchedulesList } from "./features/Schedule/components/PersonalSchedulesList";
import { CreateUser } from "./features/User/components/CreateUser/CreateUser";
import { Login } from "./features/Login/components/Login";
import { ShiftTypeList } from "./features/ShiftType/components/ShiftTypeList/ShiftTypeList";
import { PositionList } from "./features/Position/components/PositionList/PositionList";
import { LocationList } from "./features/Location/components/LocationList/LocationList";
import { UserList } from "./features/User/components/UserList/UserList";

function App() {
  let navigate = useNavigate();

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    navigate("/");
  }, []);

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
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/shiftTypes" element={<ShiftTypeList />} />
        <Route path="/positions" element={<PositionList />} />
        <Route path="/locations" element={<LocationList />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </div>
  );
}

export default App;
