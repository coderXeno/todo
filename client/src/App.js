import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import TasksPage from "./components/TasksPage";
import AddTaskPage from "./components/AddTaskPage";
import TaskDetail from "./components/TaskDetailPage";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Auth />} />
          <Route path = "/home/:userId" element = {<TasksPage />} />
          <Route path = "/add-task/:userId" element = {<AddTaskPage />} />
          <Route path = '/task-detail/:taskId' element = {<TaskDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};