document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById("role");
    const uploadImageDiv = document.getElementById("uploadImage");

    roleSelect.addEventListener("change", () => {
        if (roleSelect.value === "forcasseur") {
            uploadImageDiv.style.display = "block";
        } else {
            uploadImageDiv.style.display = "none";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulaire');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;
        const motdepasse = document.getElementById('motdepasse').value;
        const role = document.getElementById('role').value;
        const photoFile = document.getElementById('photoIdentite').files[0];

        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('email', email);
        formData.append('motdepasse', motdepasse);
        formData.append('role', role);
        if (role === 'forcasseur' && photoFile) {
            formData.append('photoIdentite', photoFile);
        }


        fetch('http://localhost:5000/api/utilisateurs', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Sauvegarder les infos utiles dans localStorage
                    localStorage.setItem('userId', data.user._id);
                    localStorage.setItem('role', data.user.role);

                    // Redirection vers compte.html
                    window.location.href = "compte.html";
                } else {
                    alert("Erreur d'inscription : " + data.message);
                }
            })
            .catch(err => {
                console.error("Erreur :", err);
                alert("Une erreur est survenue lors de l'inscription.");
            });
    });
});

res.json({
    success: true,
    user: savedUser
});

const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { nom, email, password, role } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ nom, email, password: hash, role });
        await newUser.save();
        res.status(201).json({ message: "Inscription réussie" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

