let addbtn = document.querySelector('.add-btn');
let infobtn = document.querySelector('.info-btn');
let modal = document.querySelector('.modal-const');
let colorinfo = document.querySelector('.color-info');
let textareaContent = document.querySelector('.textarea-const');
let allprioritycolors = document.querySelectorAll('.priority');
let main_container = document.querySelector('.main-container');
let flag_addmodal = true;
let toolboxColor = document.querySelectorAll('.color');
let removebtn = document.querySelector('.remove-btn');
let removeflag = false;
let micbtn = document.querySelector('.microphone-btn');
let microphoneFlag = false;
let colours = ["color-pink","color-blue","color-green","color-yellow"];
let modalPriorityColor=colours[colours.length - 1];
let filterByVoice = false;


let ticketArray = [];

if(localStorage.getItem("jira_ticket")){
    //recieve data and display
    // ticketArray=JSON.parse(localStorage.getItem("jira_ticket"));
    // ticketArray.forEach((ticketObj,i)=>{
    //     createTicket(ticketObj.ticketColor, ticketObj.task_value, ticketObj.ID)
    // })
    let str = localStorage.getItem("jira_ticket");
    let arr = JSON.parse(str);
    ticketArray = arr;
    for(let i=0;i<arr.length;i++){
        let ticketObj = arr[i];
        createTicket(ticketObj.ticketColor, ticketObj.task_value, ticketObj.ticketID);
    }

}
//filtering by colour
for(let i=0; i<toolboxColor.length; i++){
    toolboxColor[i].addEventListener("click", (e)=>{
        let currentToolBoxColor=toolboxColor[i].classList[0];

        let filteredTickets = ticketArray.filter((ticketObj, idx)=>{
            return currentToolBoxColor===ticketObj.ticketColor;
        })

        //remove all ticket
        let allTicketsCont = document.querySelectorAll(".ticket-container");
        for(let i=0; i<allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }

        //display filtered tickets only
        filteredTickets.forEach((ticketObj, idx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.task_value, ticketObj.ticketID);
        })
    })


    toolboxColor[i].addEventListener("dblclick", (e) => {
        //remove all ticket
        let allTicketsCont = document.querySelectorAll(".ticket-container");
        for(let i=0; i<allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }

        ticketArray.forEach((ticketObj, idx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.task_value, ticketObj.ticketID);
        })
    })
}

//**modal display function**/
function modalDisplay(){

    if(flag_addmodal){
        modal.style.display="flex";
    }
    else{
        modal.style.display="none";
    }
    flag_addmodal=!flag_addmodal;
}
//text area apears on add-btn click
addbtn.addEventListener("click",function(){
    modalDisplay();
})

infobtn.addEventListener("mouseenter",function(){
    colorinfo.style.display="flex";

    setTimeout(function() {
        colorinfo.style.display="none";
      }, 2000);

})



//remove btn turns red on click
function activateDelet(){
    if(removeflag){
        removebtn.style.color = 'black';
    }
    else{
        removebtn.style.color = 'red';
    }
    removeflag=!removeflag;
}
removebtn.addEventListener("click",function(){
    activateDelet();
})





//selection of colour for ticket
for(let i=0; i<allprioritycolors.length; i++){
    let priorityDivColor = allprioritycolors[i];
    priorityDivColor.addEventListener("click",function(e){
        for (let j = 0; j < allprioritycolors.length; j++) {
            allprioritycolors[j].classList.remove("actives");
        }
        priorityDivColor.classList.add("actives");
        modalPriorityColor = priorityDivColor.classList[0];
    })
}

modal.addEventListener("keydown",function(e){
    let key = e.key;
    console.log(key)
    if(key === "Shift"){
        
        createTicket(modalPriorityColor, textareaContent.value);
        
        flag_addmodal=!flag_addmodal;
        setModalToDefault();
    }
})

function createTicket(ticketColor, task_value, ticketID){
    let ID = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute('class','ticket-container');
    ticketCont.innerHTML=`<div class="ticket-color ${ticketColor}"></div>
                          <div class="ticket-id">#${ID}</div>
                          <div class="text-area">${task_value}</div>
                          <div class="ticket-lock-cont">
                                <i class="ticket-lock fa fa-lock" aria-hidden="true"></i> 
                          </div>
                          `
    main_container.appendChild(ticketCont);
    
    
    ticketCont.addEventListener("click",function(){
        if(removeflag){
            let idx=getTicketIdx(ID);

            //storage removal
            ticketArray.splice(idx,1);
            let strTicketArr=JSON.stringify(ticketArray);
            localStorage.setItem("jira_ticket",strTicketArr);

            ticketCont.remove();//ui removal
        }
    })

    //handel colour
    let ticketcolorBand = ticketCont.querySelector(".ticket-color");
    ticketcolorBand.addEventListener("click",function(){
        let currentTicketColor =ticketcolorBand.classList[1];
        let currentTicketColorIdx = -1;
        for(let i=0; i<colours.length; i++){
            if(currentTicketColor==colours[i]){
                currentTicketColorIdx = i;
                break;
            }
        }
        if(currentTicketColorIdx == -1){
            currentTicketColorIdx=0
        }
        // console.log(currentTicketColorIdx)
        let nextcolorIdx = ((currentTicketColorIdx+1)%colours.length);
        let nextcolour = colours[nextcolorIdx];
        ticketcolorBand.classList.remove(currentTicketColor);
        ticketcolorBand.classList.add(nextcolour);

        let ticketIdx = getTicketIdx(ID);
        ticketArray[ticketIdx].ticketColor = nextcolour;
        
        //modify data in local storage(ticket color change)
        let stringifyArr = JSON.stringify(ticketArray);
        localStorage.setItem("jira_ticket",stringifyArr);
    })


    // let UnlockClass = "fa fa-lock-open"
    let lockElem = ticketCont.querySelector('.ticket-lock');
    let ticketTaskArea = ticketCont.querySelector('.text-area');
    lockElem.addEventListener("click",function(){
        // lockElem.classList.remove(ticketLockClass);
        // lockElem.classList.add(UnlockClass);

        
        if (lockElem.classList.contains("fa-lock")) {
            lockElem.classList.remove("fa-lock");
            lockElem.classList.add("fa-unlock");
            ticketTaskArea.setAttribute("contenteditable","true");
            // ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            lockElem.classList.remove("fa-unlock");
            lockElem.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable","false");
            // ticketTaskArea.setAttribute("contenteditable", "false");
        }
        //modify data in local area(ticket task)
        let ticketIdx = getTicketIdx(ID);
        console.log(ID);
        console.log(ticketIdx);
        ticketArray[ticketIdx].task_value = ticketTaskArea.innerHTML;
        let stringifyArr = JSON.stringify(ticketArray);
        localStorage.setItem("jira_ticket",stringifyArr);
    })

    if(!ticketID){
        console.log('--------------------------------------------')
        ticketArray.push({ticketColor, task_value, ticketID:ID});
        localStorage.setItem("jira_ticket",JSON.stringify(ticketArray));
    }
   
}

function setModalToDefault(){
    textareaContent.value = "";
        
    modal.style.display = "none";
    for (let j = 0; j < allprioritycolors.length; j++) {
        allprioritycolors[j].classList.remove("actives");
    }
    allprioritycolors[allprioritycolors.length-1].classList.add("actives");
}

function getTicketIdx(id){
    for(let i=0; i<ticketArray.length; i++){
        console.log(ticketArray[i]);
        if(ticketArray[i].ticketID==id){
            return i;
        }
    }
}

//Voice assistant**

micbtn.addEventListener("click",function(){
    if(microphoneFlag){
        micbtn.style.color = 'black'; 
    }
    else{
        micbtn.style.color = 'red';

        // ayang start
        if (annyang) {
            // Let's define our first command. First the text we expect, and then the function it should call
            var commands = {
                'start voice': function() {
                    console.log("voice feature enabled");
                },
                'show text area':function(){
                    console.log("modal display");
                    modalDisplay();
                },
                'activate delete':function(){
                    console.log("delect button activated");
                    activateDelet();
                },
                'create ticket *tag':function(variable){
                    let input = variable.split(" ");
                    let VoiceTicketColour = input[0];
                    // colours = ["color-pink","color-blue","color-green","color-yellow"];
                    console.log(VoiceTicketColour);
                    if(VoiceTicketColour=="pink" || VoiceTicketColour=="link"){
                        modalPriorityColor=colours[0];
                    }
                    else if(VoiceTicketColour=="green"){
                        modalPriorityColor=colours[2];
                    }
                    else if(VoiceTicketColour=="blue"){
                        modalPriorityColor=colours[1];
                    }
                    else{
                        modalPriorityColor=colours[3];
                    }
                    let VoiceTaskvalue = input.slice(2);
                    let ticketTask= "";
                    for(let i=0; i<VoiceTaskvalue.length; i++){
                        ticketTask=ticketTask+VoiceTaskvalue[i]+" ";
                    }
                    console.log(modalPriorityColor);
                    console.log(ticketTask);
                    createTicket(modalPriorityColor, ticketTask);
                    
                },
                'show only *tag':function(variable){
                    console.log("filter by voice chal gya");
                    if(variable=='yellow'){
                        currentToolBoxColor="color-yellow";
                        filterByVoice = true;
                        console.log("filter by voice yello");
                    }
                    else if(variable=='pink' || variable=='link'){
                        currentToolBoxColor="color-pink";
                        filterByVoice = true;
                        console.log("filter by voice pink");
                    }
                    else if(variable=='green'){
                        currentToolBoxColor="color-green";
                        filterByVoice = true;
                        console.log("filter by voice green");
                    }
                    else if(variable=='blue'){
                        currentToolBoxColor="color-blue";
                        filterByVoice = true;
                        console.log("filter by voice blue");
                    }
                    else{
                        filterByVoice = false;
                    }

                    if(filterByVoice){
                        let filteredTickets = ticketArray.filter((ticketObj, idx)=>{
                            return currentToolBoxColor===ticketObj.ticketColor;
                            })
        
                            //remove all ticket
                            let allTicketsCont = document.querySelectorAll(".ticket-container");
                            for(let i=0; i<allTicketsCont.length; i++){
                                allTicketsCont[i].remove();
                            }
        
                            //display filtered tickets only
                            filteredTickets.forEach((ticketObj, idx)=>{
                                createTicket(ticketObj.ticketColor, ticketObj.task_value, ticketObj.ticketID);
                            })
                    }
                },

                'show all tickets':function(){
                    console.log("show all chal gya");
                    let allTicketsCont = document.querySelectorAll(".ticket-container");
                    for(let i=0; i<allTicketsCont.length; i++){
                        allTicketsCont[i].remove();
                    }

                    ticketArray.forEach((ticketObj, idx)=>{
                        createTicket(ticketObj.ticketColor, ticketObj.task_value, ticketObj.ticketID);
                    })

                }
            
            };
          
                // Add our commands to annyang
            annyang.addCommands(commands);
          
                // Start listening. You can call this here, or attach this call to an event, button, etc.
            annyang.start();    
        }
    }
    microphoneFlag=!microphoneFlag;
})

