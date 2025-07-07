document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Lorsque le formulaire est soumis
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Récupère les valeurs des champs de connexion
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Vérifie si les identifiants sont corrects
        if (username === 'admin' && password === 'gmd2025') {
            // Si tout est bon, on redirige l'administrateur vers le tableau de bord
            window.location.href = 'admin-dashboard.html';  // Remplace par le nom de ta page d'admin
        } else {
            // Si les identifiants sont incorrects, on affiche un message d'erreur
            errorMessage.style.display = 'block';
        }
    });
});