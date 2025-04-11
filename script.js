document.addEventListener("DOMContentLoaded", () => {

// TIME-BASED BACKGROUND
const hour = new Date().getHours();
if (hour >= 6 && hour < 12) {
  document.body.classList.add("morning");
} else if (hour >= 12 && hour < 17) {
  document.body.classList.add("afternoon");
} else if (hour >= 17 && hour < 20) {
  document.body.classList.add("evening");
} else {
  document.body.classList.add("night");
}





    // WEATHER
// WEATHER with Geolocation
const weatherKey = "527de0f6ad6d4067872162531251104"; // ← Replace with your actual key

function fetchWeather(lat, lon) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${lat},${lon}&aqi=no`)
    .then(res => res.json())
    .then(data => {
      const weatherBox = document.getElementById("weather");
      weatherBox.innerHTML = `
        <h2>Weather in ${data.location.name}</h2>
        <p>${data.current.condition.text}</p>
        <p>🌡️ ${data.current.temp_c}°C</p>
        <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" />
      `;
      const condition = data.current.condition.text.toLowerCase();

      if (condition.includes("sunny")) {
        document.body.classList.add("weather-sunny");
      } else if (condition.includes("cloudy")) {
        document.body.classList.add("weather-cloudy");
      } else if (condition.includes("rain") || condition.includes("drizzle")) {
        document.body.classList.add("weather-rain");
      } else if (condition.includes("snow")) {
        document.body.classList.add("weather-snow");
      } else {
        document.body.classList.add("weather-default");
      }
      
    })
    .catch(err => {
      document.getElementById("weather").innerHTML = "<p>Unable to fetch weather.</p>";
      console.error("Weather error:", err);
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    },
    error => {
      console.error("Geolocation error:", error);
      document.getElementById("weather").innerHTML = "<p>Location permission denied.</p>";
    }
  );
} else {
  document.getElementById("weather").innerHTML = "<p>Geolocation not supported.</p>";
}


    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        document.getElementById("quote").innerHTML = `
          <h2>Quote of the Day</h2>
          <p>"${data.content}"</p>
          <p><em>- ${data.author}</em></p>
        `;
      })
      .catch(err => {
        console.error("Quote fetch error:", err);
        document.getElementById("quote").innerHTML = `
          <h2>Quote of the Day</h2>
          <p>"Be yourself; everyone else is already taken."</p>
          <p><em>- Oscar Wilde</em></p>
        `;
      });
  
    // TODO LIST
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
  
    function loadTodos(filter = "all") {
      const todos = JSON.parse(localStorage.getItem("todos") || "[]");
      todoList.innerHTML = "";
      todos.forEach((todo, index) => {
        if (
          (filter === "completed" && !todo.completed) ||
          (filter === "pending" && todo.completed)
        ) return;
    
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${todo.text}</span>
          <br>
          <small>Created: ${new Date(todo.createdAt).toLocaleDateString()}</small>
          ${todo.completed ? `<br><small>Completed: ${new Date(todo.completedDate).toLocaleDateString()}</small>` : ""}
        `;
        if (todo.completed) li.classList.add("completed");
        li.addEventListener("click", () => {
          todos[index].completed = !todos[index].completed;
          todos[index].completedDate = todos[index].completed ? new Date().toISOString() : null;
          localStorage.setItem("todos", JSON.stringify(todos));
          loadTodos(currentFilter);
        });
        todoList.appendChild(li);
      });
    }
    let currentFilter = "all";

    document.querySelectorAll(".filter").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        loadTodos(currentFilter);
      });
    });
        
  
    todoInput.addEventListener("keypress", e => {
      if (e.key === "Enter" && todoInput.value.trim()) {
        const todos = JSON.parse(localStorage.getItem("todos") || "[]");
        todos.push({
          text: todoInput.value.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedDate: null
        });
        localStorage.setItem("todos", JSON.stringify(todos));
        todoInput.value = "";
        loadTodos();
      }
    });
  
    loadTodos();
  
    // FLIP CLOCK 
    function updateFlipClock() {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, '');
  
      const ids = ['hour1', 'hour2', 'minute1', 'minute2', 'second1', 'second2'];
      for (let i = 0; i < ids.length; i++) {
        const digitEl = document.getElementById(ids[i]);
        if (digitEl.textContent !== timeStr[i]) {
          digitEl.classList.remove('flip');
          void digitEl.offsetWidth; // reflow
          digitEl.textContent = timeStr[i];
          digitEl.classList.add('flip');
        }
      }
    }
  
    setInterval(updateFlipClock, 1000);
    updateFlipClock();
  
    // DARK MODE
    const toggle = document.getElementById("theme-toggle");
    const userPref = localStorage.getItem("theme");
  
    if (userPref === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    } else {
      toggle.textContent = "🌙";
    }
  
    toggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggle.textContent = isDark ? "☀️" : "🌙";
    });
});