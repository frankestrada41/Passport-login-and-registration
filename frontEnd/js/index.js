window.onload = async () => {
  await fetchHTML('/')
  sendInpuText()
}

document.addEventListener("click", async (e) => {
  const { target } = e;
  if (!target.matches("nav a")) {
    return;
  }
  e.preventDefault();
  urlPathHandler(e)
});

const routes = {
  '/': {
    template: 'templates/login.html',
    name: 'login',
  },
  '/register': {
    template: 'templates/register.html',
    name: 'register',
  },
  '/welcomePage': {
    template: 'templates/welcomePage.html',
    name: 'welcomePage'
  }
}

const urlPathHandler = async (event) => {
  if (event.target.innerHTML === 'Login') {
    await fetchHTML('/')
    changeURLRouter(routes['/'].name)
    sendInpuText()
  }
  if (event.target.innerHTML === 'Register') {
    await fetchHTML('/register')
    changeURLRouter(routes['/register'].name)
    sendInpuText()
  }
}

const fetchHTML = async (route) => {
  const html = await fetch(routes[route].template).then((response) => response.text());
  document.getElementById("content").innerHTML = html;
}

const changeURLRouter = (route) => {
  document.title = route;
  window.history.pushState({}, "", route);
}

window.addEventListener("popstate", (e) => {
  if (e.state) {
    document.getElementById("content").innerHTML = e.state.html;
    document.title = e.state.pageTitle;
  }
});

const sendInpuText = () => {
  const button = document.getElementById("formButton")

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const userEmail = document.getElementById("uEmail").value
    const password = document.getElementById("pWord").value
    const isLogin = window.location.href.includes('register') ? false : true
    let serverResponse;
    const body = JSON.stringify({
      email: userEmail,
      password,
    })
    if (isLogin) {
      serverResponse = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body,
      }).then((response) => response.text())
      fetchHTML("/welcomePage")
      changeURLRouter(routes['/welcomePage'].name)
    } else {
      const userName = document.getElementById("uName").value
      serverResponse = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          "authorization": `Bearer ${btoa(`${userEmail}:${password}:${userName}`)}`,
        }
      }).then((response) => response.text())
      fetchHTML("/")
      changeURLRouter(routes['/'].name)
    }
  });
}