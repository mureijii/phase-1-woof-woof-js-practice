document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterBtn = document.getElementById("good-dog-filter");
    let allPups = [];
    let filterOn = false;

    // Fetch all pups and render them
    function fetchPups() {
        fetch("http://localhost:3000/pups")
            .then(res => res.json())
            .then(pups => {
                allPups = pups;
                renderPups(pups);
            });
    }

    function renderPups(pups) {
        dogBar.innerHTML = "";
        pups.forEach(pup => {
            const span = document.createElement("span");
            span.textContent = pup.name;
            span.addEventListener("click", () => showPupDetails(pup));
            dogBar.appendChild(span);
        });
    }

    function showPupDetails(pup) {
        dogInfo.innerHTML = `
            <img src="${pup.image}" alt="${pup.name}">
            <h2>${pup.name}</h2>
            <button id="toggle-dog">${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;
        const toggleBtn = document.getElementById("toggle-dog");
        toggleBtn.addEventListener("click", () => toggleGoodDog(pup));
    }

    function toggleGoodDog(pup) {
        pup.isGoodDog = !pup.isGoodDog;
        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isGoodDog: pup.isGoodDog })
        })
        .then(() => {
            document.getElementById("toggle-dog").textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";
            if (filterOn) renderPups(allPups.filter(p => p.isGoodDog));
        });
    }

    filterBtn.addEventListener("click", () => {
        filterOn = !filterOn;
        filterBtn.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
        renderPups(filterOn ? allPups.filter(p => p.isGoodDog) : allPups);
    });

    fetchPups();
});
