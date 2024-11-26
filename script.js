const loider = document.querySelector('.loider');
const body = document.querySelector('body');

window.addEventListener('load', ()=>{
    
   setTimeout(()=>{
        loider.classList.add("hidden");
        body.classList.remove("hidden");
   },4000);
})

