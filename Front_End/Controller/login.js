import {UserModel} from "../Model/UserModel.js";

$("#submitBtn").on('click', () => {
    // Get input values
    var email = $("#mail").val();
    var password = $("#pw").val();

    // Replace this with your actual email and password validation logic
    var correctEmail = "";
    var correctPassword = "";

    fetch('http://localhost:8080/pos_back_end_war_exploded/login')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                correctEmail = user.mail
                correctPassword = user.password


                // Check if email and password are correct
                if (email === correctEmail && password === correctPassword) {
                    // Redirect to another page
                    window.location.href = "forms/index.html";
                } else {
                    alert("Incorrect email or password. Please try again.");
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});


