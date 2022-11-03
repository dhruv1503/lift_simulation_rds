const renderSection = document.getElementById("render_section");
const floorInput = document.getElementById("floor_input");
const liftInput = document.getElementById("lift_input");
const generateButton = document.getElementById("generate-button");
const formInput = Array.from(document.getElementsByClassName("form_input"));
const body = document.body;

const userInput = {
    lift: 0,
    floor: 0
}


// add event Listeners 
floorInput.addEventListener("input", ((e) =>{userInput.floor = e.target.value}))
liftInput.addEventListener("input", ((e)=>{userInput.lift = e.target.value}))


generateButton.addEventListener("click", ()=> {
    // debugger
    let screenWidth = body.getBoundingClientRect().width;

    // Floor Value check
    if(userInput.floor == null){
        window.alert("Please specify the number of floors");
    }
    else if(userInput.floor <= 1){
        window.alert("Please enter more than one floor");
    }

    // Lifts value check
    else if(userInput.lift == null){
        window.alert("Please specify the number of lifts");
    }
    else if(userInput.lift < 1){
        window.alert("Please enter at least one lift");
    }
    else if(screenWidth < 300){
        window.alert("Device above 300 px is required");
    }
    // if screenInput is between 300 and 700 and user.lift is more than 5
    else if(screenWidth <= 800 && screenWidth >= 300 && userInput.lift > 5){
        window.alert("Please enter less than 5 number of lifts for this screen size");
    }

    // if screenInput is less than 850 and user.lift is more than 5
    else if(screenWidth >= 1300 && screenWidth < 800 && userInput.lift >= 7){
        window.alert("Please enter less than 7 number of lifts for this screen size");
    }

    // if screenInput is greater than 1300 and user.lift is more than 11
    else if(screenWidth <= 1600 && screenWidth > 1300 && userInput.lift >= 11){
        window.alert("Please enter less than 11 number of lifts for this screen size");
    }

    else{
      createFloors();
      createLifts();
    }
})




// 
/*
* function to create floors
* It clears the inner html every time it's called 
* Takes value from userInput.floor and create the number of floors accordingly
* after rendering the floors, it adds event listeners to floor's buttons
*/
function createFloors(){
    
    renderSection.innerHTML = "";
    if(userInput.floor >= 0){
        for(let i = 0; i < userInput.floor; i++){
            let floor = document.createElement("div");
            floor.setAttribute("class", "floor");
            floor.setAttribute("id", `floor-${i}`)
            floor.setAttribute("data-floor", i);
         
            if(i === 0){
                floor.innerHTML =
                `<div class="floor_elements">
                 <p>Floor-${i}</p>
                <div class="floor_buttons">
                <button class="floor_button floor_button--up" data-floor=${i}>⬆️</button>
                </div>
                </div>`
                
            }
            else if(i === userInput.floor - 1 ){
                floor.innerHTML=
                `<div class="floor_elements">
                <p>Floor-${i}</p>
                <div class="floor_buttons">
      <button class="floor_button floor_button--down" data-floor=${i}>⬇️</button>
  </div>`
    
}
else{
    floor.innerHTML =
    `<div class="floor_elements">
            <p>Floor-${i}</p>
    <div class="floor_buttons">
    <button class="floor_button floor_button--up" data-floor=${i}>⬆️</button>
    <button class="floor_button floor_button--down" data-floor=${i}>⬇️</button>
    </div>`
}
renderSection.append(floor);
 }
}
    addButtonListeners()
}


// Lift calling button event listeners
function addButtonListeners(){
    setTimeout(buttonHandler, 2000);
   
}



// function to create lifts, it takes in values userInput.lift values and adds the number of lifts accordingly.
function createLifts(){
   const groundFloor = document.getElementById("floor-0")
    for(let i = 0; i < userInput.lift; i++){
        let lift = document.createElement("div");
        lift.setAttribute("class", "lift");
        lift.setAttribute("data-current-floor","0");
        lift.setAttribute("data-called-floor","0");
        lift.setAttribute("id", `lift-${i}`)
        lift.innerHTML = `
        <div class="lift_door lift_door--left"></div>
        <div class="lift_door lift_door--right"></div>`
        groundFloor.append(lift);
    }
    
}

/*
* Button handler function takes all buttons from floor and assigns the clicked button's floor value to assigned lift's called value
* selectLift() function returns desired lift index which has to move
* moveLift() takes the value returned by selectLift() and moves the desired lift 
 */  
function buttonHandler(){
  let buttons = Array.from(document.getElementsByClassName("floor_button"));
  let liftArray = Array.from(document.getElementsByClassName("lift"));
   buttons.map((button)=>{
    button.addEventListener("click", ()=>{
        
        let liftIndex = selectLift(button.dataset.floor);
        liftArray[liftIndex].dataset.calledFloor = button.dataset.floor;
        
        moveLift(liftIndex);
    })
   })
}

// select most favourable lift closest to floor and not busy
function selectLift(floorNo){
    
let liftArray = Array.from(document.getElementsByClassName("lift"));

let difference = Number.MAX_SAFE_INTEGER;
let liftToMove = null;

/// for not letting the busy lift take additional 
for(let i = 0; i < liftArray.length; i++){


    // If lift is busy check next lift
    if(liftArray[i].classList.contains("busy")){

        continue;
    }
        else{
            // Check which lift is closest to called floor 
            let presentLiftDifference = Math.abs(liftArray[i].dataset.currentFloor - floorNo);
            if(presentLiftDifference < difference){
              difference = presentLiftDifference;
              liftToMove = i;
            }
            
               
        }
    
    }
    return liftToMove;

}

// moveLift() function takes in a parameter liftNo
function moveLift(liftNo){
    // Object destructuring can happen here.
    
let selectedLift = document.getElementsByClassName("lift")[liftNo];
let currentFloor = selectedLift.dataset.currentFloor;
let calledFloor = selectedLift.dataset.calledFloor;
let difference = calledFloor - currentFloor;
if(currentFloor > calledFloor){
    difference = currentFloor - calledFloor;
}


let distanceToTravel = document.getElementsByClassName("floor")[0].getBoundingClientRect().height * calledFloor;

let timeTaken = 2000 * difference;



// Add movement to lift 
selectedLift.style.transform = `translateY(${-distanceToTravel}px)`;
selectedLift.style.transitionDuration = `${timeTaken}ms`
selectedLift.style.transitionTimingFunction = `ease-in-out`
selectedLift.dataset.currentFloor = calledFloor;
selectedLift.classList.add("busy");
setTimeout(operateLiftDoors, timeTaken, selectedLift);
setTimeout(() => {selectedLift.classList.remove("busy")}, timeTaken + 5000);

}


/*
* Function for opening and closing door of lift 
* The door_operating--left and door_operating--right classes are already created in style.css
* Function takes one parameter selectedLift, which it should take from moveLift()
* This function is executed in moveLift()
*/
function operateLiftDoors(selectedLift){

 selectedLift.children[0].classList.add("door_operating--left");
 selectedLift.children[1].classList.add("door_operating--right");
 setTimeout(()=>{ selectedLift.children[0].classList.remove("door_operating--left");
}, 5000);
setTimeout(()=>{ selectedLift.children[1].classList.remove("door_operating--right");
}, 5000);

}







