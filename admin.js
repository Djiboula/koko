document.addEventListener('DOMContentLoaded', function () {
    const usersList = document.getElementById('users-list');
    const subscriptionsList = document.getElementById('subscriptions-list');
    const publishForm = document.getElementById('publishForm');
    const resultImageInput = document.getElementById('resultImage');
    const resultNameInput = document.getElementById('resultName');

    // Exemple d'utilisateurs et abonnements pour test
    const users = [
        { id: 1, username: 'parieur1', role: 'parieur', status: 'abonné' },
        { id: 2, username: 'forcasseur1', role: 'forcasseur', status: 'en attente' },
        { id: 3, username: 'parieur2', role: 'parieur', status: 'abonné' },
    ];

    const subscriptions = [
        { id: 1, username: 'forcasseur1', status: 'en attente' },
        { id: 2, username: 'parieur2', status: 'abonné' }
    ];

    // Fonction pour afficher la liste des utilisateurs
    function displayUsers() {
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.username} (${user.role}) - ${user.status}`;
            usersList.appendChild(li);
        });
    }

    // Fonction pour afficher la liste des abonnements
    function displaySubscriptions() {
        subscriptionsList.innerHTML = '';
        subscriptions.forEach(subscription => {
            const li = document.createElement('li');
            li.textContent = `${subscription.username} - ${subscription.status}`;
            subscriptionsList.appendChild(li);
        });
    }

    // Fonction pour publier un résultat
    publishForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const resultName = resultNameInput.value;
        const resultImage = resultImageInput.files[0];

        if (!resultName || !resultImage) {
            alert('Veuillez entrer un nom pour le résultat et sélectionner une image.');
            return;
        }

        // Simule l'ajout de publication (cela devrait être géré avec un backend)
        alert(`Résultat publié : ${resultName}`);
        // Réinitialiser le formulaire
        publishForm.reset();
    });

    // Appel des fonctions pour afficher les données
    displayUsers();
    displaySubscriptions();
});

// Fonction pour supprimer un utilisateur
function deleteUser(userId) {
    axios.delete(`http://localhost:5000/api/users/${userId}`)
        .then(response => {
            alert('Utilisateur supprimé avec succès!');
            // Réactualiser la liste des utilisateurs après la suppression
            fetchUsers();
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            alert('Une erreur est survenue lors de la suppression de l\'utilisateur.');
        });
}

