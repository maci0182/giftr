//Create a Cordova Android App that lets people store gift ideas.
//
//There will be two mains screens and two modal popups. The first screen is the list of people that you have added to the app along with their birthdays. Each person will have an arrow to navigate to the second page, a list of gift ideas for that person. The person screen will also have a button to open a modal popup to add a new person. Clicking on a person's name from the list, will also open the same modal popup but it allows the user to edit the person instead of adding a new one.
//
//On the gift page there will be a button for adding a new idea to the list. The modal popup for adding gifts will ask for the idea, the location where it can be bought, a URL where it can be found online, and a cost. The list of gifts will display the idea and then optionally the other three things about the idea. If any of the other fields are empty then they are not displayed in the list. There will also be a delete button for each idea so it can be removed.
//
//All the data needs to be saved in localStorage. Use the key "giftr-abcd0001", but replace the abcd0001 with your own username.

'use strict';
var listofPeople = new Array();
var listofIdea = new Array();
var currentPerson;
var listGift;
var localStorageKey = "giftr-maci0182";

document.addEventListener('deviceready', onDeviceReady);

window.addEventListener('push', function(ev){
    
    let contentDiv = ev.currentTarget.document.querySelector(".content")
    let id = contentDiv.id;
    console.log("Content Div ID " + id);
    
    // Switch statement to find on what page user is 
    switch(id){
        case "index":
            let buttonSave = document.getElementById("savebtn");
            buttonSave.addEventListener("click", savePerson);
            console.log("Clicked Save Button" + buttonSave);
            
            let cancelButton = document.getElementById("cancelbtn");
            cancelButton.addEventListener("click", cancelModal);
            console.log("Clicked Cancel Button" + cancelButton);
            // Display all the list of the Poeple
            displayPeopleList();
            break;
            
        case "gifts":
            let saveGift = document.getElementById("saveGiftButton");
            saveGift.addEventListener("click", saveGift);
            console.log("Save Gift button is clicked " + saveGift);
            
            let cancelGift = document.getElementById("cancelGiftButton");
            cancelGift.addEventListener("click", cancelGiftModal);
            determinePerson();
            break;
            // If nothing happenes from above switch statement then display list of people
        default:
            displayPeopleList();
    }
    
});

function onDeviceReady(){
     let buttonSave = document.getElementById("savebtn");
            buttonSave.addEventListener("click", savePerson);
            console.log("Clicked Save Button" + buttonSave);
            
    let cancelButton = document.getElementById("cancelbtn");
            cancelButton.addEventListener("click", cancelModal);
            console.log("Clicked Cancel Button" + cancelButton);
            // Display all the list of the Poeple
            displayPeopleList();
}



// Let's save a person for that let's go ahead and create a function of Save person 

function savePerson(){
    let saveName = document.getElementById("nameField").value;
    console.log("Save Name " + saveName);
    
    let saveDate = document.getElementById("dateField").value;
    console.log("Date Saved " + saveDate);
    
    if(currentPerson == 0){
        let currentTime = new Date().getTime / 1000;
        console.log("Current Time is " + currentTime);
        
        let person = {
            id: currentTime,
            name: saveName,
            dob: saveDate,
            ideas: new Array()
        };
        
        listofPeople.push(person);
  }
    else{
       for(let i = 0; i < listofPeople.length; i++){
           if(listofPeople[i].id == currentPerson){
               listofPeople[i].name = saveName;
               listofPeople[i].dob = saveDate;
               
           }
       }
    }
    
    currentPerson = 0;
    setLocalStorage();
    cancelModal();
    displayPeopleList();

 }

function displayPeopleList(){
    getLocalStorage();
    
    let list = document.getElementById("contact-list");
    list.innerHTML = "";
    console.log("The list of contact is " + list);
    
    for(let i = 0; i < listofPeople.length; i++){
        let li = document.createElement("li");
        li.className = "table-view-cell";
        li.setAttribute("dataId", listofPeople[i].id);
        console.log("li " + li);
        
        let span = document.createElement("span");
        span.className = "name";
        
        let listName = document.createElement("a");
        listName.textContent = listofPeople[i].name;
        listName.href = "#personModal"
        console.log("Name " + listName);
        listName.setAttribute("data-name", listofPeople[i].name);
        listName.setAttribute("data-dob", listofPeople[i].dob);
        
        let spanDate = document.createElement("span");
        spanDate.className = "dob";
        spanDate.textContent = moment(listofPeople[i].dob).format("MMMM DD");
        
        let listDate = document.createElement("a");
        listDate.className = "navigate-right pull-right";
        listDate.href = "gifts.html";
        
        span.appendChild(listName);
        listDate.appendChild(spanDate);
        // Appened Name
        li.appendChild(span);
        // Appened Date
        li.appendChild(listDate);
        list.appendChild(li);
        console.log
        listName.addEventListener("touchstart", editButton);
        listDate.addEventListener("touchstart", pageSwitch);
    }
}

function setLocalStorage(){
    console.log("The key is " + localStorageKey);
    localStorage.setItem(localStorageKey, JSON.stringify(listofPeople));
    console.log("People are set in the localStorage");
}
function getLocalStorage(){
    console.log("The key is " + localStorageKey);
    let getItem = localStorage.getItem(localStorageKey);
    console.log("Get " + getItem);
    listofPeople = JSON.parse(getItem);
    console.log("List of People from LocalStorage " + listofPeople);
}
function cancelModal(){
      var end = new CustomEvent('touchend', {
        bubbles: true,
        cancelable: true
    });
    console.log("End " + end);
    var dispatchEvent = document.querySelector("a#xButton");
    dispatchEvent.dispatchEvent(end);
    console.log("Dispatch Event" + dispatchEvent);
}


function editButton(ev){
   //Edit Person 

   currentPerson = ev.target.parentElement.parentElement.attributes.dataId.nodeValue;
    console.log("Edit Person " + currentPerson);
    document.getElementById("nameField").value = ev.target.dataset.name;
    document.getElementById("dateField").value = ev.target.dataset.dob;
}
function pageSwitch(ev){
    console.dir(ev);
    listGift = ev.target.parentElement.attributes.dataId.nodeValue;
}
function determinePerson(){
    for(var i = 0; i < listofPeople.length; i++){
        if(listGift == listofPeople[i].id){
            listofIdea = listofPeople[i].ideas;
            console.log("List of Idea " + listofIdea);
            
            document.getElementById("addName").textContent = listofPeople[i].name;
            document.getElementById("giftTitle").textContent = 
                listofPeople[i].name;
            console.log("Title " + listofPeople[i].name);
            break;
        }
    }
    displayGiftList();
}
function saveGift(){
    let savedGifts = document.getElementById("giftField").value;
    console.log("Save gifts " + savedGifts);
    let savedStore = document.getElementById("storeField").value;
    console.log("Saved Store " + savedStore);
    let savedUrl = document.getElementById("urlField").value;
    console.log("Saved URL " + savedUrl);
    let costSaved = document.getElementById("costField").value;
    console.log("Cost Saved " + costSaved);
    
    let currentTime = new Date().getDate() / 1000;
    
    let giftIdea = {
        idea: savedGifts,
        at: savedStore,
        url: savedUrl,
        cost: costSaved,
        id: currentTime
    }
    console.log("Gift Idea " + giftIdea);
    
    listofIdea.push(giftIdea);
    console.log("List of Ideas " + listofIdea);
    
    saveToContact();
    document.getElementById("giftField").value = "";
    document.getElementById("storeField").value = "";
    document.getElementById("urlField").value = "";
    document.getElementById("costField").value = "";
    
   cancelGiftModal();
    
    displayGiftList();
}
function displayGiftList(){
    let listOfGift = document.getElementById("gift-list");
    listOfGift.innerHTML = "";
    
    for(var i = 0; i < listofIdea.length;i++){
        let li = document.createElement("li");
        li.className = "table-view-cell media";
        li.setAttribute("dataId", listofIdea[i].id);
        console.log("Li" + li);
        let span = document.createElement("span");
        span.className = "pull-right icon icon-trash midline";
        console.log("Trash Icon " + span);
        let div = document.createElement("div");
        div.className = "media-body";
        div.textContent = listofIdea[i].idea;
        
        
        if(listofIdea[i].at != ""){
            let location = document.createElement("p");
            location.textContent = listofIdea[i].at;
            div.appendChild(location);
            console.log("Location " + location.textContent);
        }
        if(listofIdea[i].url != ""){
            let url = document.createElement("p");
            url.textContent = listofIdea[i].url;
            div.appendChild(url);
            console.log("URL " + url.textContent)
        }
        if(listofIdea[i].url != ""){
            let cost = document.createElement("p");
            cost.textContent = listofIdea[i].cost;
            div.appendChild(cost);
        }
        li.appendChild(span);
        li.appendChild(div);
        listOfGift.appendChild(li);
        
    }
}
function cancelGiftModal(){
    var end = new CustomEvent('touchend', {
        bubbles: true,
        cancelable: true
    });
    console.log("End " + end);
    var dispatchEvent = document.querySelector("a#xGiftButton");
    dispatchEvent.dispatchEvent(end);
    console.log("Dispatch Event" + dispatchEvent);
}
function saveToContact(){
    for(var i = 0; i < listofPeople.length; i++){
        if(listGift == listofPeople[i].id){
            console.log("People List " + listofPeople[i].id);
            listofPeople[i].ideas = listofIdea;
             console.log("People List " + listofPeople[i].id);
            console.log("The length " + listofPeople.length);
        }
    }
    setLocalStorage();
}





