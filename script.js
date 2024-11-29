const loider = document.querySelector('.loider');
const modal = document.getElementById("Modal");
const openBtn = document.querySelector(".addbtn");
const closeBtn = document.querySelector(".close");
const position = document.getElementById("position");
const statsDiv = document.getElementById("stats");
const Form = document.getElementById("Form");
const ratingOutput = document.getElementById("rating");
const allStats = document.querySelector('.all-stats');
const gkStats = document.querySelector('.gk-stats');
const plContainer = document.querySelector('.pl-container');
const btnSub = document.querySelector(".btn-sub");
const Cards = document.querySelectorAll(".card");
const detailsDiv = document.querySelector(".det");
const detName = document.getElementById("det-name");
const detPosition = document.getElementById("det-position");
const detRating = document.getElementById("det-rating");
const detNationality = document.getElementById("det-nationality");
const detClub = document.getElementById("det-club");
const detStats = document.getElementById("det-stats");
const detClose = document.querySelector('.close-det');
const data = document.querySelectorAll('.data');
const deleteBtn = document.querySelector('.deletebtn');
const noPl = document.querySelector('.noPl');
const goBack = document.querySelector('.goback');

const plList = JSON.parse(localStorage.getItem("list")) || [];

let clicked = true;

    window.addEventListener('load', ()=>{
        
    setTimeout(()=>{
            loider.classList.add("hidden");
    },4000);

    plList.forEach((p)=>{
    plContainer.innerHTML += `<div class="card crd" id="lw"
        data-name="${p.plname}">
        <img class="card-img" src="images/empty-card.webp" alt="bg">
        <div class="stats">
            <div class="pl-img">
                <img class="plimg" src="${p.photo}" alt="">
            </div>
            <p class="pl-name">${p.plname}</p>
            <p class="pl-power">${p.Rating}</p>
            <p class="pl-pos">${p.position}</p>
            <div class="flags">
                <img src="${p.nationalite}" alt="">
                <img src="${p.club}" alt="">
            </div>
        </div>
    </div>`;
    })


    const changement = document.querySelectorAll(".crd");
    const hiddenCardsMap = new Map();

    data.forEach((el)=>{
        el.onclick=function(){
            const positionP = el.previousElementSibling;
            detailsDiv.classList.add("hidden");
            plContainer.classList.remove("hidden");
            changement.forEach((p)=>{

                if (positionP.textContent === p.querySelector('.pl-pos').textContent){
                    p.classList.add('shake');
                    p.onclick=function(){
                    const statsDiv = p.querySelector(".stats");
                    if (hiddenCardsMap.has(el)) {
                        const previousCard = hiddenCardsMap.get(el);
                        previousCard.style.display = "flex";
                        hiddenCardsMap.delete(el);
                    }
                    el.innerHTML = statsDiv.outerHTML;
                    p.style.display ='none';

                    hiddenCardsMap.set(el, p);
                    changement.forEach((c)=>{
                    c.classList.remove('shake');
                    c.classList.remove('occupie');
                    c.onclick = null;
                    clicked=false;
                    setTimeout(() => {
                        clicked=true;
                    }, 500);
                   })
                }
                }else{
                    p.classList.add('occupie');
                    const allOcc = [...changement].every(card => card.classList.contains('occupie'));
                    if(allOcc){
                        noPl.classList.remove("hidden");
                        goBack.addEventListener('click',()=>{
                            noPl.classList.add("hidden");
                            changement.forEach(p=>{
                                p.classList.remove('shake');
                                p.classList.remove('occupie');
                            })
                        })
                    }
                }
            });
        }
    });
    



    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

    position.addEventListener("change", () => {
        const selectedPos = position.value;
        if(selectedPos === 'GK'){
            gkStats.classList.remove('hidden');
            allStats.classList.add("hidden");
        }
        else{
            allStats.classList.remove("hidden");
            gkStats.classList.add('hidden');
        }
        calculRating();
    });

    
    statsDiv.addEventListener("input", calculRating);
    function calculRating() {
        const inputs = statsDiv.querySelectorAll("input[type='number']");
        let total = 0;
        inputs.forEach(input => {
            total += Number(input.value || 0); 
        });

        const Rating = Math.round(total / 6);
        ratingOutput.textContent = Rating;
    }


    btnSub.addEventListener("click", (e) => {
        e.preventDefault();

        const playerData = {
            plname: plname.value,
            photo: photo.value,
            nationalite: nationalite.value,
            club: club.value,
            position: position.value,
            pace: pace.value,
            shooting: shooting.value,
            passing: passing.value,
            physical: physical.value,
            dribbling: dribbling.value,
            defending: defending.value,
            Rating: ratingOutput.value
        };
    
        
        if (position.value === 'GK') {
            playerData.diving = diving.value;
            playerData.reflexes = reflexes.value;
            playerData.handling = handling.value;
            playerData.kicking = kicking.value;
            playerData.positioning = positioning.value;
            playerData.jumping = jumping.value;

            delete playerData.defending;
            delete playerData.shooting;
            delete playerData.passing;
            delete playerData.dribbling;
            delete playerData.physical;
        }

        let isValid = true;
        if (!/^[A-Za-z\s]{2,11}$/.test(playerData.plname)) {
            isValid = false;
            alert("Player name must be 2-11 characters long and contain only letters and spaces.");
        }

        if (!photo.value.trim()) {
            isValid = false;
            alert("Photo URL cannot be empty.");
        }
    
        if (!nationalite.value.trim()) {
            isValid = false;
            alert("Nationality (flag URL) cannot be empty.");
        }
    
        if (!club.value.trim()) {
            isValid = false;
            alert("Club (logo URL) cannot be empty.");
        }
    

        if (!isValid) {
            return; 
        }

        const plList = JSON.parse(localStorage.getItem("list")) || [];
        if (plList.some(p => p.plname.toLowerCase() === playerData.plname.toLowerCase())) {
            alert("Player with this name already exists.");
            return;
        }
        plList.push(playerData);
        
        const newCardHTML = `
        <div class="card crd" id="lw"
             data-name="${playerData.plname}">
             <img class="card-img" src="images/empty-card.webp" alt="bg">
             <div class="stats">
                 <div class="pl-img">
                     <img class="plimg" src="${playerData.photo}" alt="">
                 </div>
                 <p class="pl-name">${playerData.plname}</p>
                 <p class="pl-power">${playerData.Rating}</p>
                 <p class="pl-pos">${playerData.position}</p>
                 <div class="flags">
                     <img src="${playerData.nationalite}" alt="">
                     <img src="${playerData.club}" alt="">
                 </div>
             </div>
         </div>`;

        plContainer.innerHTML += newCardHTML;

        localStorage.setItem("list", JSON.stringify(plList));

        const newCard = plContainer.querySelector(`[data-name="${playerData.plname}"]`);
        newCard.addEventListener("click", () => {
        const player = plList.find(p => p.plname === playerData.plname);
        if (player) {
            detName.textContent = player.plname;
            detPosition.textContent = player.position;
            detRating.textContent = player.Rating;
            detNationality.src = player.nationalite;
            detClub.src = player.club;

            detailsDiv.classList.remove("hidden");
            plContainer.classList.add("hidden");
        }
    });

        modal.classList.add("hidden");
        gkStats.classList.add('hidden');
        allStats.classList.add("hidden");

        Form.reset();
    });




    
    plContainer.addEventListener("click", (e) => {
        if (clicked){
        const card = e.target.closest(".card"); 

        deleteBtn.addEventListener('click',()=>{
            card.remove();
            detailsDiv.classList.add("hidden");
            plContainer.classList.remove("hidden");
        })

        if (!card) return;
    
        const plName = card.getAttribute("data-name");
        const plList = JSON.parse(localStorage.getItem("list")) || [];
        const player = plList.find(p => p.plname === plName);
    
        if (player) {
            detName.textContent = player.plname;
            detPosition.textContent = player.position;
            detRating.textContent = player.Rating;
            detNationality.src = player.nationalite;
            detClub.src = player.club;
    
            if (player.position === "GK") {
                detStats.innerHTML = `
                    <p>Diving: ${player.diving || '-'}</p>
                    <p>Reflexes: ${player.reflexes || '-'}</p>
                    <p>Handling: ${player.handling || '-'}</p>
                    <p>Kicking: ${player.kicking || '-'}</p>
                    <p>Positioning: ${player.positioning || '-'}</p>
                    <p>Jumping: ${player.jumping || '-'}</p>
                `;
            } else {
                detStats.innerHTML = `
                    <p>Pace: ${player.pace || '-'}</p>
                    <p>Shooting: ${player.shooting || '-'}</p>
                    <p>Passing: ${player.passing || '-'}</p>
                    <p>Physical: ${player.physical || '-'}</p>
                    <p>Dribbling: ${player.dribbling || '-'}</p>
                    <p>Defending: ${player.defending || '-'}</p>
                `;
            }
    
            detailsDiv.classList.remove("hidden");
            plContainer.classList.add("hidden");
        }
    }
    });
    

detClose.addEventListener('click',()=>{
    detailsDiv.classList.add("hidden");
    plContainer.classList.remove("hidden");
} );


});