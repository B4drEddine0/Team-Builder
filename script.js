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
const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');
const switchBtn = document.getElementById('switchbtn');
const resetBtn = document.getElementById('resetbtn');
const hamburgerBtn = document.querySelector('.hamburger-btn');
const content = document.querySelector('.content');
const closeOverlay = document.createElement('div');

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
                        previousCard.style.display = "";
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
                                p.classList.remove('occupie');
                                p.classList.remove('shake');
                                p.onclick = null;
                            })
                        })
                    }
                }
            });
        }
    });
    



    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () =>{modal.classList.add("hidden"); plContainer.classList.remove('hidden')});

    position.addEventListener("change", () => {
        const selectedPos = position.value;
        ratingOutput.textContent = "0";
        if(selectedPos === 'GK'){
            gkStats.classList.remove('hidden');
            allStats.classList.add("hidden");

            allStats.querySelectorAll("input").forEach(input => input.disabled = true);
            gkStats.querySelectorAll("input").forEach(input => input.disabled = false);
        }
        else{
            allStats.classList.remove("hidden");
            gkStats.classList.add('hidden');

            gkStats.querySelectorAll("input").forEach(input => input.disabled = true);
            allStats.querySelectorAll("input").forEach(input => input.disabled = false);
        }
        calculRating();
    });

    
    statsDiv.addEventListener("input", calculRating);
    function calculRating() {
        const inputs = statsDiv.querySelectorAll("input[type='number']:not([disabled])");
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
            Rating: ratingOutput.textContent
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

        const plList = JSON.parse(localStorage.getItem("list")) || [];

        if (btnSub.textContent === "Update Player") {
            const index = plList.findIndex(p => p.plname === playerData.plname);  
            if (index !== -1) {
                plList[index] = playerData;
                localStorage.setItem("list", JSON.stringify(plList));
    
                const card = document.querySelector(`.card[data-name="${playerData.plname}"]`);
                if (card) {
                    card.querySelector(".pl-name").textContent = playerData.plname;
                    card.querySelector(".plimg").src = playerData.photo;
                    card.querySelector(".pl-power").textContent = playerData.Rating;
                    card.querySelector(".pl-pos").textContent = playerData.position;
                    const flags = card.querySelector(".flags").children;
                    flags[0].src = playerData.nationalite;
                    flags[1].src = playerData.club;
                }
            }
        } else {
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

        Form.reset();}
    });




    
    plContainer.addEventListener("click", (e) => {
        if (clicked){
        const card = e.target.closest(".card"); 
        const cardindex = card.getAttribute("data-name");
        deleteBtn.addEventListener('click',()=>{
            card.remove();
            
            const plList = JSON.parse(localStorage.getItem('list') || []);
            const updatedList = plList.filter(p=> p.plname !== cardindex);
            localStorage.setItem("list",JSON.stringify(updatedList));
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

            /*****modification */
            const editBtn = detailsDiv.querySelector('.editebtn');
            editBtn.addEventListener("click", () => {
            modal.classList.remove("hidden");
            detailsDiv.classList.add("hidden");
            
            
            document.getElementById("plname").value = player.plname;
            document.getElementById("photo").value = player.photo;
            document.getElementById("nationalite").value = player.nationalite;
            document.getElementById("club").value = player.club;
            document.getElementById("position").value = player.position;
            ratingOutput.textContent = player.Rating;

          
            if (player.position === "GK") {
                gkStats.classList.remove('hidden');
                allStats.classList.add('hidden');

                document.getElementById("diving").value = player.diving || 0;
                document.getElementById("reflexes").value = player.reflexes || 0;
                document.getElementById("handling").value = player.handling || 0;
                document.getElementById("kicking").value = player.kicking || 0;
                document.getElementById("positioning").value = player.positioning || 0;
                document.getElementById("jumping").value = player.jumping || 0;
            } else {
                gkStats.classList.add('hidden');
                allStats.classList.remove('hidden');

                document.getElementById("pace").value = player.pace || 0;
                document.getElementById("shooting").value = player.shooting || 0;
                document.getElementById("passing").value = player.passing || 0;
                document.getElementById("physical").value = player.physical || 0;
                document.getElementById("dribbling").value = player.dribbling || 0;
                document.getElementById("defending").value = player.defending || 0;
            }
            
            btnSub.textContent = "Update Player";
            btnSub.onclick = function (e) {
                e.preventDefault();

                
                player.plname = document.getElementById("plname").value;
                player.photo = document.getElementById("photo").value;
                player.nationalite = document.getElementById("nationalite").value;
                player.club = document.getElementById("club").value;
                player.position = document.getElementById("position").value;
                player.Rating = ratingOutput.textContent;

                if (player.position === "GK") {
                    player.diving = document.getElementById("diving").value;
                    player.reflexes = document.getElementById("reflexes").value;
                    player.handling = document.getElementById("handling").value;
                    player.kicking = document.getElementById("kicking").value;
                    player.positioning = document.getElementById("positioning").value;
                    player.jumping = document.getElementById("jumping").value;
                } else {
                    player.pace = document.getElementById("pace").value;
                    player.shooting = document.getElementById("shooting").value;
                    player.passing = document.getElementById("passing").value;
                    player.physical = document.getElementById("physical").value;
                    player.dribbling = document.getElementById("dribbling").value;
                    player.defending = document.getElementById("defending").value;
                }
                 localStorage.setItem("list", JSON.stringify(plList));

                 card.querySelector('.pl-name').textContent = player.plname;
                 card.querySelector('.plimg').src = player.photo;
                 card.querySelector('.pl-power').textContent = player.Rating;
                 card.querySelector('.pl-pos').textContent = player.position;
                 const flags = card.querySelectorAll('.flags img');
                 flags[0].src = player.nationalite;
                 flags[1].src = player.club;
 
                 btnSub.textContent = "Add Player";
                 modal.classList.add("hidden");
                 plContainer.classList.remove("hidden");
                 Form.reset();
                 window.location.reload();
                };
            });
        }
    }
    });
    

            detClose.addEventListener('click',()=>{
            detailsDiv.classList.add("hidden");
            plContainer.classList.remove("hidden");
        } );

        switchBtn.addEventListener('click',()=>{
            if(form2.classList.contains('hidden')){
                form1.classList.add('hidden');
                form2.classList.remove('hidden');
            }else{
                form1.classList.remove('hidden');
                form2.classList.add('hidden');
            }
            
        })

        resetBtn.addEventListener('click',()=>{
            window.location.reload();
        })


});


closeOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 98;
`;

document.body.appendChild(closeOverlay);

hamburgerBtn.addEventListener('click', () => {
    content.classList.add('active');
    closeOverlay.style.display = 'block';
    hamburgerBtn.classList.add('hidden');
});



closeOverlay.addEventListener('click', () => {
    content.classList.remove('active');
    closeOverlay.style.display = 'none';
    hamburgerBtn.classList.remove('hidden');
});
