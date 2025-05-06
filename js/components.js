// Cargar componentes compartidos
document.addEventListener('DOMContentLoaded', function() {
    cargarComponentes();
});

function cargarComponentes() {
    // Navbar
    document.getElementById('navbar-placeholder').innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <i class="fas fa-book"></i> Gestión Docente
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="index.html">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Acerca de</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`;
    
    // Footer
    document.getElementById('footer-placeholder').innerHTML = `
        <footer class="bg-dark text-white text-center py-4 mt-5">
            <div class="container">
                <p>&copy; 2025 Plataforma de Gestión Docente | Proyecto académico - Inacap</p>
                <ul class="list-inline mb-2">
                    <li class="list-inline-item"><a class="text-white text-decoration-none" href="index.html">Inicio</a></li>
                </ul>
                <p><i class="fas fa-envelope"></i> contacto@Inacap.cl | <i class="fas fa-phone"></i> +56 9 1234 5678</p>
                <div class="mt-2">
                    <a href="#" class="text-white me-2"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="text-white me-2"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="text-white"><i class="fab fa-linkedin"></i></a>
                </div>
                <em class="d-block mt-2">"Educando para el futuro, hoy."</em>
            </div>
        </footer>`;
}
