try {
    const navbar = document.getElementById("navbar")
    window.navbar = navbar
    
    const navbarStates = {
        menuOpen: false,
    }
    
    navbar.menuButton = navbar.querySelector("#menuButton")
    navbar.menuButton.onclick = toggleMenu
    
    navbar.menu = navbar.querySelector("#menu")
    navbar.menu.addEventListener('animationend', (event) => {
        navbar.menu.style.animation = null
    })
    
    function toggleMenu() {
        if (navbarStates.menuOpen) {
            closeMenu()
        } else {
            openMenu()
        }
    }
    
    function openMenu() {
        navbar.menu.classList.add("open")
        navbar.menu.style.top = `${navbar.clientHeight}px`
        navbar.menu.style.animation = "navbar-menu-open 0.3s"
        navbarStates.menuOpen = true
    }
    
    function closeMenu() {
        navbar.menu.classList.remove("open")
        navbar.menu.style.top = `${navbar.clientHeight}px`
        navbar.menu.style.animation = "navbar-menu-open 0.3s reverse"
        navbarStates.menuOpen = false
    }
    
    navbar.home = navbar.querySelector("#home")
    navbar.about = navbar.querySelector("#about")
    navbar.portfolio = navbar.querySelector("#portfolio")
    navbar.reviews = navbar.querySelector("#reviews")
} catch (e) {
    alert("navbar.js -- " + e)
}
