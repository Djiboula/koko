// Simulation des données utilisateur
const utilisateur = {
    role: "forcasseur", // ou "parieur"
    dateInscription: "2025-02-10",
    abonnementActif: false // à mettre à true après confirmation admin
};

const messageAbonnement = document.getElementById("messageAbonnement");
const lienBanque = document.getElementById("lienBanque");
const zoneParieur = document.getElementById("zoneParieur");
const zoneForcasseur = document.getElementById("zoneForcasseur");

function differenceEnJours(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

document.addEventListener("DOMContentLoaded", () => {
    const aujourdHui = new Date();
    const dateInscription = new Date(utilisateur.dateInscription);
    const joursEcoules = differenceEnJours(dateInscription, aujourdHui);

    if (joursEcoules <= 60) {
        messageAbonnement.textContent = `Période gratuite active (${60 - joursEcoules} jours restants)`;
    } else {
        if (utilisateur.abonnementActif) {
            messageAbonnement.textContent = "Abonnement actif. Merci !";
        } else {
            messageAbonnement.textContent = "Votre période gratuite est terminée. Merci de vous abonner pour continuer.";
            lienBanque.style.display = "inline-block";
            lienBanque.href = "https://votre-lien-banque.com"; // À remplacer par ton vrai lien
        }
    }

    if (utilisateur.role === "parieur") {
        if (joursEcoules <= 60 || utilisateur.abonnementActif) {
            zoneParieur.style.display = "block";
            document.getElementById("numeros").innerHTML = `
          <div class="card">
            <p><strong>Nom :</strong> Super Win</p>
            <p><strong>Date :</strong> 10/04/2025</p>
            <p><strong>Heure :</strong> 14h22</p>
            <p><strong>Par :</strong> Força One</p>
          </div>`;
        }
    } else if (utilisateur.role === "forcasseur") {
        if (joursEcoules <= 60 || utilisateur.abonnementActif) {
            zoneForcasseur.style.display = "block";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const contenu = document.getElementById('contenu-compte');

    if (!userId) {
        alert("Vous devez être connecté.");
        window.location.href = "connexion.html";
        return;
    }

    // Vérifie l’abonnement
    axios.get(`http://localhost:5000/api/subscriptions/user/${userId}`)
        .then(response => {
            const abonnement = response.data;

            if (abonnement.status !== "abonné") {
                contenu.innerHTML = `
            <section class="alert">
              <h2>Accès restreint</h2>
              <p>Votre abonnement est en attente de validation par l’administrateur.</p>
            </section>
          `;
            } else {
                // Si abonnement validé, afficher les options selon le rôle
                if (role === "forcasseur") {
                    afficherForcasseur();
                } else if (role === "parieur") {
                    afficherParieur();
                } else {
                    contenu.innerHTML = "<p>Rôle inconnu.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Erreur lors de la vérification de l’abonnement :", error);
            contenu.innerHTML = `<p>Erreur de chargement. Veuillez réessayer.</p>`;
        });
});

function afficherForcasseur() {
    const contenu = document.getElementById('contenu-compte');
    contenu.innerHTML = `
      <section>
        <h2>Bienvenue Forcasseur</h2>
        <form id="formNumero">
          <label for="nomNumero">Nom du numéro :</label>
          <input type="text" id="nomNumero" required />
  
          <label for="numero">Numéro :</label>
          <input type="text" id="numero" required />
  
          <label for="commentaire">Commentaire :</label>
          <textarea id="commentaire" rows="3"></textarea>
  
          <button type="submit">Publier</button>
        </form>
      </section>
    `;

    document.getElementById("formNumero").addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {
            userId: localStorage.getItem("userId"),
            nomNumero: document.getElementById("nomNumero").value,
            numero: document.getElementById("numero").value,
            commentaire: document.getElementById("commentaire").value
        };

        axios.post("http://localhost:5000/api/publications", data)
            .then(() => alert("Numéro publié avec succès !"))
            .catch(() => alert("Erreur lors de la publication."));
    });
}

function afficherParieur() {
    const contenu = document.getElementById('contenu-compte');

    axios.get("http://localhost:5000/api/publications")
        .then(response => {
            const publications = response.data;
            if (publications.length === 0) {
                contenu.innerHTML = "<p>Aucune publication disponible.</p>";
                return;
            }

            contenu.innerHTML = "<h2>Numéros publiés</h2><ul id='listePublications'></ul>";
            const liste = document.getElementById("listePublications");

            publications.forEach(pub => {
                const item = document.createElement("li");
                item.innerHTML = `
            <strong>${pub.nomNumero}:</strong> ${pub.numero}<br />
            Par ${pub.nomForcasseur} - ${new Date(pub.date).toLocaleString()}<br />
            Commentaire: ${pub.commentaire}
          `;
                liste.appendChild(item);
            });
        })
        .catch(() => {
            contenu.innerHTML = "<p>Erreur lors du chargement des numéros.</p>";
        });
}



// Gestion de l'abonnement
const abonnementContainer = document.getElementById("publicationsContainer");
const creationDate = localStorage.getItem("dateCreation") || (() => {
    const now = Date.now();
    localStorage.setItem("dateCreation", now);
    return now;
})();

const abonnementDate = localStorage.getItem("dernierAbonnement");
const maintenant = Date.now();
const joursDepuisCreation = Math.floor((maintenant - parseInt(creationDate)) / (1000 * 60 * 60 * 24));
const joursDepuisAbonnement = abonnementDate ? Math.floor((maintenant - parseInt(abonnementDate)) / (1000 * 60 * 60 * 24)) : null;

const publications = JSON.parse(localStorage.getItem("publications") || "[]");
const publicationsValides = publications.filter(pub => maintenant - pub.timestamp < 24 * 60 * 60 * 1000);

function afficherPublications() {
    if (publicationsValides.length > 0) {
        publicationsValides.forEach(pub => {
            const date = new Date(pub.timestamp);
            const heure = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const auteur = pub.auteur || "Utilisateur inconnu";
            const bloc = document.createElement("div");
            bloc.classList.add("tirage-card");
            bloc.innerHTML = `
             <p style="font-size: 0.9em; color: gray;">🕒 Publié à ${heure}</p>
             <h4>${pub.titre}</h4>
             <p>${pub.contenu}</p>
             <p style="font-size: 0.8em; color: #666;">👤 Publié par : <strong>${auteur}</strong></p>`;
            abonnementContainer.appendChild(bloc);
        });
    } else {
        abonnementContainer.innerHTML = "<p>Aucune publication récente.</p>";
    }
}

if (joursDepuisCreation <= 60) {
    // Période gratuite active
    afficherPublications();
} else {
    // Période gratuite terminée, vérifie si abonnement valide
    if (abonnementDate && joursDepuisAbonnement <= 30) {
        afficherPublications();
    } else {
        abonnementContainer.innerHTML = `
         <p style="color: red; font-weight: bold;">⛔ Votre période d’essai est terminée.</p>
         <p>Veuillez vous abonner pour continuer à accéder aux numéros publiés.</p>
         <button onclick="activerAbonnement()">S’abonner maintenant</button>
     `;
    }
}

function activerAbonnement() {
    const now = Date.now();
    localStorage.setItem("dernierAbonnement", now);
    alert("Abonnement activé pour 30 jours !");
    window.location.reload();
}

// Nettoyage des publications expirées
localStorage.setItem("publications", JSON.stringify(publicationsValides));
