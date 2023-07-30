//Front end script for Sophie Bluel Portfolio website

//GET API and save data in localStorage_______________________________________________________________
let projects = window.localStorage.getItem('projects');
if (projects === null) {
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();

    const projectsObj = JSON.stringify(projects);
    window.localStorage.setItem("projects", projectsObj)
}
else {
    projects = JSON.parse(projects);
}
//counter to check if page was already charged IOT to ativate first button in green
let alreadyLogged = false;

//first call to create first project grid
createArticle(projects);

//Create Projects elements_________________________________________________________________________________
function createArticle(projects) {

    //For each project
    for (let i = 0; i < projects.length; ++i) {

        //Create figure
        const articleFigure = document.createElement("figure");
        //Create image
        const figureImage = document.createElement("img");
        figureImage.src = projects[i].imageUrl;
        //Create caption
        const figureCaption = document.createElement("figcaption");
        figureCaption.innerText = projects[i].title;

        //Append Child
        const gallery = document.querySelector(".gallery");
        //check to prevent errors when script is invoked in other html page
        if (gallery) {
            gallery.appendChild(articleFigure);
        }
        articleFigure.appendChild(figureImage);
        articleFigure.appendChild(figureCaption);
    }

    if (alreadyLogged === false) {
        const buttonActivated = document.getElementById("button1")
        //check to prevent errors when script is invoked in other html page
        if (buttonActivated) {
            buttonActivated.classList.add("button_Selected");
        }
    }
    alreadyLogged = true;

}

//Create Login elements___________________________________________________________________________________
const loggedData = localStorage.getItem("logged");
let logged = loggedData ? JSON.parse(loggedData) : {test: false};

if (logged.test === true) {
    console.log("logged = " + logged.test);
    createLoginElements();
}
function createLoginElements() {

    const loggedinContainer = document.createElement("section");
    loggedinContainer.classList.add("logged_container");
    const header = document.querySelector(".header");
    header.classList.add("header_logged");

    header.prepend(loggedinContainer);
}

//filters__________________________________________________________________________________________________

//declare arrays => one iteration per button
const buttonId = [];
const projectCategory = [];

//create a filter function for each button
for (let i = 1, numButton = 4; i < numButton + 1; ++i) {
    buttonId[i] = document.getElementById("button" + i);

    //check to prevent errors when script is invoked in other html page
    if (buttonId[i]) {
        //event listener on each button
        buttonId[i].addEventListener("click", function () {

            //Unselect every button /Select new button
            for (let j = 1, numButton = 4; j < numButton + 1; ++j) {
                buttonId[j].classList.remove("button_Selected");
            }
            buttonId[i].classList.add("button_Selected");

            //display all projects => invoke first function
            if (i === 1) {
                document.querySelector(".gallery").innerHTML = "";
                createArticle(projects);
            }

            //filter functions
            else {
                projectCategory[i] = projects.filter(function (e) {
                    return e.categoryId === i - 1;
                })

                document.querySelector(".gallery").innerHTML = "";
                createArticle(projectCategory[i]);
            }
        })
    }
}
