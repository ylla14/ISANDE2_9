function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const userId = document.getElementById("userId").value; // Get the actual value of the input field
    const enteredPassword = document.getElementById("password").value; // Get the actual value of the input field
    const loginMessage = document.getElementById("login-message"); // Updated element reference

    // Clear previous login message
    loginMessage.textContent = '';

    // Send a POST request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, password: enteredPassword }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        if (data.message === 'Login successful') {

            sessionStorage.setItem('userId', userId);
            //added this to store sales rep info and pass
            if (data.salesRep) {
                localStorage.setItem('salesRepId', data.salesRep.id);
                localStorage.setItem('salesRepName', data.salesRep.name);
            }
            
            window.location.href = data.homepage; // Redirect to the homepage on successful login
        } else {
            loginMessage.textContent = "Invalid User ID or password";
            loginMessage.style.color = "red";
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        loginMessage.textContent = "An error occurred. Please try again.";
        loginMessage.style.color = "red";
    });
}

document.addEventListener("DOMContentLoaded", function() {
    var loginButton = document.querySelector(".login-button");
    
    if (loginButton) {
      loginButton.addEventListener("click", handleLogin);
    } else {
      console.error("Login button not found in the document.");
    }
});
