import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo, setFilter } from "./todoSlice";

const Todo = () => {
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("0");
  const [year, setYear] = useState(new Date().getFullYear());
  const [timeInput, setTimeInput] = useState("12:00");
  const [timeError, setTimeError] = useState("");

  const todos = useSelector((state) => state.todos.todos);
  const filter = useSelector((state) => state.todos.filter);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      setTextError("");
    }
  };

  const handleTimeInputChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length >= 3) {
      value = value.slice(0, 2) + ":" + value.slice(2, 4);
    }
    setTimeInput(value);

    const [hh, mm] = value.split(":").map(Number);
    if (
      isNaN(hh) || isNaN(mm) ||
      hh < 0 || hh > 23 ||
      mm < 0 || mm > 59
    ) {
      setTimeError("атата!!! неверное время, должно быть вот так: 1530 → 15:30");
    } else {
      setTimeError("");
    }
  };

  const getSelectedDeadline = () => {
    const [h, m] = timeInput.split(":").map(Number);
    const date = new Date(year, month, parseInt(day), h || 0, m || 0);
    return date.toISOString();
  };

  const handleAddTodo = () => {
    if (!text.trim()) {
      setTextError("атата, вы не ввели задачу!!!");
      return;
    }
    if (timeError) return;

    const deadline = getSelectedDeadline();
    dispatch(addTodo({ text, deadline }));
    setText("");
    setTextError("");
    setTimeInput("12:00");
  };

  const handleToggleComplete = (id) => dispatch(toggleComplete(id));
  const handleDeleteTodo = (id) => dispatch(deleteTodo(id));
  const handleFilterChange = (filter) => dispatch(setFilter(filter));

  const getDeadlineColor = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeDiff < 0) return "red";
    if (timeDiff > oneDay) return "green";
    return "yellow";
  };

  const getTodosToShow = () => {
    const now = new Date();

    return todos.filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "active") return !todo.completed;
      if (filter === "red") return !todo.completed && new Date(todo.deadline) < now;
      if (filter === "yellow") {
        const diff = new Date(todo.deadline) - now;
        return !todo.completed && diff >= 0 && diff <= 24 * 60 * 60 * 1000;
      }
      if (filter === "green") {
        const diff = new Date(todo.deadline) - now;
        return !todo.completed && diff > 24 * 60 * 60 * 1000;
      }
      return true; // "all"
    });
  };

  const groupByDate = (todos) => {
    return todos.reduce((acc, todo) => {
      const date = new Date(todo.deadline).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(todo);
      return acc;
    }, {});
  };

  const groupedTodos = groupByDate(getTodosToShow());

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>pink_todo_list</h2>

      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Добавьте задачу"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      {textError && <p style={{ color: "hotpink" }}>{textError}</p>}

      <div style={{ marginTop: "10px" }}>
        <label>Дата: </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <select value={day} onChange={(e) => setDay(e.target.value)} style={{ padding: "8px" }}>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ padding: "8px" }}>
            {[
              "Январь", "Февраль", "Март", "Апрель",
              "Май", "Июнь", "Июль", "Август",
              "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ].map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ padding: "8px" }}>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2023 + i}>{2023 + i}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Время: </label>
        <input
          type="text"
          value={timeInput}
          onChange={handleTimeInputChange}
          placeholder="введите ччмм → 1530"
          maxLength={5}
          style={{ padding: "8px", marginLeft: "10px" }}
        />
        {timeError && <p style={{ color: "hotpink" }}>{timeError}</p>}
      </div>

      <button
  style={{
    marginTop: "10px",
    backgroundColor: "hotpink", 
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px",
  }}
  onClick={handleAddTodo}
>
  Добавить
</button>

      <div style={{ marginTop: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={() => handleFilterChange("all")}>Все</button>
        <button onClick={() => handleFilterChange("active")}>Активные</button>
        <button onClick={() => handleFilterChange("completed")}>Выполненные</button>
        <button onClick={() => handleFilterChange("red")} style={{ color: "red" }}>Просроченные</button>
        <button onClick={() => handleFilterChange("yellow")} style={{ color: "goldenrod" }}>Скоро дедлайн</button>
        <button onClick={() => handleFilterChange("green")} style={{ color: "green" }}>В запасе время</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {Object.entries(groupedTodos).map(([date, todos]) => (
          <div key={date}>
            <h3>{date}</h3>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                  />
                  <span style={{
                    textDecoration: todo.completed ? "line-through" : "none"
                  }}>
                    {todo.text}
                  </span>
                  {!todo.completed && todo.deadline && (
                    <span style={{
                      color: getDeadlineColor(todo.deadline),
                      marginLeft: "10px"
                    }}>
                      {new Date(todo.deadline).toLocaleTimeString()}
                    </span>
                  )}
                  {todo.completed && todo.completedDate && (
                    <span style={{ color: "gray", marginLeft: "10px" }}>
                      Завершено: {new Date(todo.completedDate).toLocaleString()}
                    </span>
                  )}
                  <button onClick={() => handleDeleteTodo(todo.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
