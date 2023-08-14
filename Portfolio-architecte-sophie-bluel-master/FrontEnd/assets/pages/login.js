//Login___________________________________________________________________________________________________
const logInForm = document.getElementById("login");

if (logInForm) {
    logInForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const data = {
            email: email,
            password: password,
        }

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.userId && result.token) {
                    //save token
                    localStorage.setItem('userToken', result.token);
                    // Login successful => redirect
                    localStorage.setItem("logged", JSON.stringify({test: true}));
                    window.location.href = "./../../index.html";
                    console.log('Loggin successfull');
                } else {
                    // Unexpected response format for successful login
                    console.log('Unexpected response format for successful login:', result);
                    alert('Login échoué, Veuillez réessayer.');
                }
            } else {
                // Handle non-2xx status codes (e.g., 4xx, 5xx)
                const errorData = await response.json();
                console.error('Login failed:', errorData.message);
                alert('Login échoué, vérifiez email et mot de passe.');
            }
        } catch (error) {
            console.error('Error during login request:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });
}