const divCreateMonster = document.querySelector("#create-monster");
const divMonsterContainer = document.querySelector("#monster-container");
const backBtn = document.querySelector("#back");
const forwardBtn = document.querySelector("#forward");
const monstersURL = "http://localhost:3000/monsters";
const pageLimit = 50;


// build form for creating monsters
let createMonsterForm = document.createElement("form");
let nameField = document.createElement("input");
nameField.type = "text";
nameField.placeholder = "Name";
let ageField = document.createElement("input");
ageField.type = "text";
ageField.placeholder = "Age";
let descriptionField = document.createElement("input");
descriptionField.type = "text";
descriptionField.placeholder = "Description";
let submitField = document.createElement("input");
submitField.type = "submit";
submitField.value = "Create Monster";
createMonsterForm.append(nameField);
createMonsterForm.append(ageField);
createMonsterForm.append(descriptionField);
createMonsterForm.append(submitField);
divCreateMonster.append(createMonsterForm);


// helper function to render one monster
function renderMonster(monster) {
  let monsterDiv = document.createElement("div");
  let nameHeader = document.createElement("h2");
  nameHeader.innerText = monster.name;
  let ageHeader = document.createElement("h4");
  ageHeader.innerText = `Age: ${monster.age}`;
  let bioPar = document.createElement("p");
  bioPar.innerText = `Bio: ${monster.description}`;

  monsterDiv.appendChild(nameHeader);
  monsterDiv.appendChild(ageHeader);
  monsterDiv.appendChild(bioPar);
  divMonsterContainer.appendChild(monsterDiv);
}

// helper function to remove all monsters from the page
function clearPage() {
  let monsters = divMonsterContainer.children;
  for(let i = 0; i < monsters.length; i++) {
    monsters[i].style.display = "none";
  }
}

// fetch a page and render it
function renderPage(pageno,limit) {
  clearPage();
  fetch(`${monstersURL}/?_limit=${limit}&_page=${pageno}`)
  .then( res => res.json() )
  .then( data => {
    data.forEach( elem => renderMonster(elem) );
  });
}


divMonsterContainer.setAttribute("data-pageno","1");
renderPage(1,pageLimit);

// event listeners
backBtn.addEventListener("click", function(e) {
  let pageno = parseInt(divMonsterContainer.getAttribute("data-pageno"));
  if (pageno > 1) {
    pageno--;
    divMonsterContainer.setAttribute("data-pageno", pageno);
    renderPage(pageno,pageLimit);
  } else {
    alert("No monsters here!");
  }
});

forwardBtn.addEventListener("click", function(e) {
  let pageno = parseInt(divMonsterContainer.getAttribute("data-pageno"));
  pageno++;
  divMonsterContainer.setAttribute("data-pageno", pageno);
  renderPage(pageno,pageLimit);
});

createMonsterForm.addEventListener("submit",function(e) {
  e.preventDefault();
  let name = nameField.value;
  let age = parseFloat(ageField.value);
  let description = descriptionField.value;
  fetch(monstersURL,
    {
      method:"POST",
      headers:
      {
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body: JSON.stringify(
        {
          name:name,
          age:age,
          description:description
        }
      )
    }
  ).then( res => res.json() )
  .then( function(data) {
    let pageno = parseInt(divMonsterContainer.getAttribute("data-pageno"));
    renderPage(pageno,pageLimit);
    createMonsterForm.reset();
  });
});