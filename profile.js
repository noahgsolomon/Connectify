document.addEventListener("DOMContentLoaded", function() {
    const emojiList = ['😀', '😁', '😂', '🤣', '😃', '😄',
        '😅', '😆', '😉', '😊', '😋','😎','😍',
        '😘', '🥰', '😗'];
    const emojiFace = emojiList[Math.round(Math.random() * 15)];

    const profileCard = document.querySelector('.profile-card');
    const body = document.querySelector('body');
    const profile = async () => {
        try {
            const response = await fetch("http://localhost:8080/profile", {
                method: "GET",
                headers: {"Content-Type":"application/json"},
                credentials: "include"
            });

            const responseBody = await response.text();
            console.log(responseBody);
            console.log(responseBody);
            return responseBody;
        } catch (error){
            console.log(error);
        }
    }

    const updateProfile = async (country, bio, cardColor, backgroundColor) => {
        const model = {
            country: country,
            bio: bio,
            cardColor: cardColor,
            backgroundColor: backgroundColor
        }
        try{
            const response = await fetch("http://localhost:8080/profile", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(model),
                credentials: "include"
            });

            const responseBody = await response.text();
            console.log(responseBody);
            return responseBody;
        }catch (error){
            console.log(error);
        }
    }

    (async () => {
        const profileJson = await profile();
        const userDetails = JSON.parse(profileJson);

        const emoji = document.querySelector('.profile-emoji');
        emoji.textContent = emojiFace;
        const profileName = document.querySelector('.profile-name');
        profileName.textContent = userDetails.username;
        const country = document.querySelector(".profile-country");
        country.textContent = 'Country: ' + userDetails.country;
        const bio = document.querySelector(".profile-bio");
        bio.textContent = 'Bio: ' + userDetails.bio;
        const category = document.querySelector(".profile-category");
        category.textContent = userDetails.topCategory + ' enthusiast';
        profileCard.style.backgroundColor = userDetails.cardColor;
        body.style.backgroundColor = userDetails.backgroundColor;

        if (!userDetails.cardColor){
            profileCard.style.backgroundColor = 'white';
        }
        if (!userDetails.backgroundColor){
            body.style.backgroundColor = 'whitesmoke'
        }

        profileCard.style.display = 'block';

    })();

    const editButton = document.querySelector('.edit-btn');
    editButton.addEventListener('click', handleEditButtonClick);
    const cancelBtn = document.querySelector('.cancel-btn');

    function handleEditButtonClick() {
        const editForm = document.querySelector('.edit-form');
        const countryInput = document.querySelector('#country');
        const bioInput = document.querySelector('#bio');
        const cardColors = document.querySelectorAll('.card-color');
        const backgroundColors = document.querySelectorAll('.bg-color');
        const initialCardColor = profileCard.style.backgroundColor;
        const initialBackgroundColor = body.style.backgroundColor;

        for (const color of cardColors){
            color.addEventListener('click', () => {
                profileCard.style.backgroundColor = color.style.backgroundColor;
            });
        }

        for (const color of backgroundColors){
            color.addEventListener('click', () => {
                body.style.backgroundColor = color.style.backgroundColor;
            });
        }

        cancelBtn.style.display = 'block';

        editForm.style.display = 'block';

        cancelBtn.addEventListener('click', () =>{
            editForm.style.display = 'none';
            cancelBtn.style.display = 'none';
            profileCard.style.backgroundColor = initialCardColor;
            body.style.backgroundColor = initialBackgroundColor;
        });


        // Add an event listener to handle form submission
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedCountry = countryInput.value.trim();
            const updatedBio = bioInput.value.trim();

            const newProfile = await updateProfile(updatedCountry, updatedBio, profileCard.style.backgroundColor, body.style.backgroundColor);
            const userDetails = JSON.parse(newProfile);
            console.log(userDetails);

            const emoji = document.querySelector('.profile-emoji');
            emoji.textContent = emojiFace;
            const profileName = document.querySelector('.profile-name');
            profileName.textContent = userDetails.username;
            const country = document.querySelector(".profile-country");
            country.textContent = 'Country: ' + userDetails.country;
            const bio = document.querySelector(".profile-bio");
            bio.textContent = 'Bio: ' + userDetails.bio;
            const category = document.querySelector(".profile-category");
            category.textContent = userDetails.topCategory + ' enthusiast';
            profileCard.style.backgroundColor = userDetails.cardColor;
            body.style.backgroundColor = userDetails.backgroundColor;


            editForm.style.display = 'none';
            editForm.reset();
            cancelBtn.style.display = 'none';
        });
    }



});