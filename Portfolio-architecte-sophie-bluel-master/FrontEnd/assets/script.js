//Front end script for Sophie Bluel Portfolio website

//GET API and save data in localStorage_______________________________________________________________
let projects = window.localStorage.getItem('projects');

if (projects === null) {
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();

    const projectsObj = JSON.stringify(projects);
    window.localStorage.setItem("projects", projectsObj);
}
else {
    projects = JSON.parse(projects);
}

//counter to check if page was already charged IOT to activate first button in green
let alreadyLogged = false;

//first call to create first project grid
createArticle(projects);

//Create Projects elements_________________________________________________________________________________
function createArticle(el) {

    //For each el
    for (let i = 0; i < el.length; ++i) {

        //Create figure
        const articleFigure = document.createElement("figure");
        //Create image
        const figureImage = document.createElement("img");
        figureImage.src = el[i].imageUrl;
        //Create caption
        const figureCaption = document.createElement("figcaption");
        figureCaption.innerText = el[i].title;
        const portfolioTitle = document.getElementById("portfolio_title");
        portfolioTitle.classList.add("portfolio_title-notLogged");

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

//ternary operator to check if logged in >> locale.storage is used to maintain logging in memory over html pages
const loggedData = localStorage.getItem("logged");
let logged = loggedData ? JSON.parse(loggedData) : {test: false};

//if logged then create
if (logged.test === true) {
    createLoginElements();
}
function createLoginElements() {

    //create black container over header
    const header = document.querySelector(".header");
    header.classList.add("header_logged");
    const loggedinContainer = document.createElement("section");
    loggedinContainer.classList.add("logged_container");
    const editModeContainer = document.createElement("div");
    editModeContainer.classList.add("logged_edit-button");
    const editModeIcon = document.createElement("i");
    editModeIcon.classList.add("fa-regular");
    editModeIcon.classList.add("fa-pen-to-square");
    const editModeText = document.createElement("h3");
    editModeText.innerHTML = "Mode édition";
    const saveButton = document.createElement("button");
    saveButton.classList.add("save_button");
    saveButton.setAttribute("id", "saveButton");
    saveButton.innerHTML = "publier les changements";

    header.prepend(loggedinContainer);
    loggedinContainer.appendChild(editModeContainer);
    editModeContainer.appendChild(editModeIcon);
    editModeContainer.appendChild(editModeText);
    loggedinContainer.appendChild(saveButton);

    //transform login in logout
    const logoutButton = document.createElement("a");
    logoutButton.classList.add("logout_button");
    logoutButton.innerHTML = "Logout";
    const loginButton = document.querySelector(".login_button");
    const loginLink = document.querySelector(".login_link");
    loginLink.innerHTML = "";

    loginButton.appendChild(logoutButton);

    //Erase Filters and add "icon + modifier" button
    const filterButton = document.querySelector(".button_Container");
    filterButton.innerHTML = "";
    const portfolioTitleLoggedContainer = document.createElement("div");
    portfolioTitleLoggedContainer.classList.add("portfolio_title-logged-div");
    const portfolio = document.getElementById("portfolio");
    const portfolioTitle = document.getElementById("portfolio_title");
    portfolioTitle.classList.add("portfolio_title-logged")
    portfolioTitle.classList.remove("portfolio_title-notLogged");
    const modifyButton = document.createElement("button");
    modifyButton.classList.add("modify_button");
    const editModeIconForTitle = document.createElement("i");
    editModeIconForTitle.classList.add("fa-regular");
    editModeIconForTitle.classList.add("fa-pen-to-square");
    const editModeTextForTitle = document.createElement("h3");
    editModeTextForTitle.innerHTML = "modifier";

    portfolio.prepend(portfolioTitleLoggedContainer);
    portfolioTitleLoggedContainer.appendChild(portfolioTitle);
    portfolioTitleLoggedContainer.appendChild(modifyButton);
    modifyButton.appendChild(editModeIconForTitle);
    modifyButton.appendChild(editModeTextForTitle);
}

//Logout logic______________________________________________________________________________________________
const logoutButton = document.querySelector(".logout_button");

if (logoutButton) {
    logoutButton.addEventListener("click", function (even) {
        //clear logged data in local storage then reload page
        localStorage.removeItem("logged");
        window.location.reload();
        createArticle(projects);
    });
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

//Modale_______________________________________________________________________________________

//All modale is made out of this array because it is only temporary and waits to be POSTed
let preview = projects.map(el => el);

//______________________|||||||create overlay||||||||__________________________________________

const overlay = document.createElement("div");
overlay.classList.add("overlay");

const body = document.body;
body.prepend(overlay);

//display overlay + 1st time modale
const modifyButton = document.querySelector(".modify_button");
if(modifyButton) {
    modifyButton.addEventListener("click", function() {
        //always invoke with preview to prevent reinvoking wrong array after project deletion
        //preview = projects duplication
        createModaleElements(preview);
    } );
}

//_____________||||||||||||||create elements|||||||||||||____________________________________
function createModaleElements(el){
    //activate overlay
    const overlay = document.querySelector(".overlay");
    overlay.style.display = 'block';

    //create modale
    const modaleContainer = document.createElement("article");
    modaleContainer.classList.add("modale");
    const modaleXmark = document.createElement("i");
    modaleXmark.classList.add("fa-solid");
    modaleXmark.classList.add("fa-xmark");
    modaleXmark.classList.add("xmark")
    const modaleTitle = document.createElement("h4");
    modaleTitle.innerHTML = "Galerie photo";
    const modaleGallery = document.createElement("div");
    modaleGallery.classList.add("modale_gallery");
    const modaleButtonContainer = document.createElement("div");
    modaleButtonContainer.classList.add("button_modale-container");
    const modaleButtonAdd = document.createElement("button");
    modaleButtonAdd.classList.add("button");
    modaleButtonAdd.classList.add("button_Selected");
    modaleButtonAdd.classList.add("button_modale")
    modaleButtonAdd.innerHTML = "Ajouter une photo";
    const modaleButtonDelete = document.createElement("button");
    modaleButtonDelete.classList.add("button_delete");
    modaleButtonDelete.innerHTML = "Supprimer la galerie"

    body.prepend(modaleContainer);
    modaleContainer.appendChild(modaleXmark);
    modaleContainer.appendChild(modaleTitle);
    modaleContainer.appendChild(modaleGallery);
    modaleContainer.appendChild(modaleButtonContainer);
    modaleButtonContainer.appendChild(modaleButtonAdd);
    modaleButtonContainer.appendChild(modaleButtonDelete);

    //create modale projects
    function createModaleGallery(el) {
        for (let i = 0; i < el.length; ++i) {
            //Create figures
            //Tips : modaleFigureContainer is here only to contain trash icon when position absolute :)
            const modaleFigureContainer = document.createElement("div");
            modaleFigureContainer.classList.add("modale_figure-container")
            modaleFigureContainer.id = "figure_" + (i + 1); //important to erase project in modale
            const modaleFigure = document.createElement("figure");
            modaleFigure.classList.add("modale_figure");
            //Create image
            const figureImage = document.createElement("img");
            figureImage.src = projects[i].imageUrl;
            figureImage.classList.add("modale_image");
            //Create caption
            const figureCaption = document.createElement("p");
            figureCaption.innerText = "éditer";
            //create delete icon
            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid");
            deleteIcon.classList.add("fa-trash-can");
            deleteIcon.classList.add("trash")
            deleteIcon.id = ("trash_" + (i + 1));

            modaleGallery.appendChild(modaleFigureContainer);
            modaleFigureContainer.appendChild(modaleFigure);
            modaleFigure.appendChild(figureImage);
            modaleFigure.appendChild(figureCaption);
            modaleFigure.prepend(deleteIcon);

        }

    }

    createModaleGallery(preview);
    closeModale(modaleXmark);
    closeModale(overlay);
    deleteProjectModale(el);
};

//___________||||||||||||||close modale|||||||||||||||||____________________________
function closeModale(el) {
    if(el) {
        el.addEventListener("click", function() {
            //hide overlay
            document.querySelector(".overlay").style.display = 'none';

            //erase modale
            const modaleContainer = document.querySelector(".modale");
            modaleContainer.remove();

            //recreate new gallery updated
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            createArticle(preview);

        });
    } else {
        return;
    }
}


//________||||||||||||||||Erase projects||||||||||||||||___________________________
//make new array to preview :
const trash = [];
console.log(preview);

//delete function : event listener on each trash icon
//>> splice new Arr
//>>callback create modal
function deleteProjectModale(el) {
    for (let i = 0; i < el.length; ++i) {
        //ex : trash[0] == #trash_1; trash[1] == #trash_2 ...; trash[i] == #trash_(i + 1)
        trash[i] = document.getElementById("trash_" + (i + 1) );
        trash[i].addEventListener("click", function() {

            //update preview[]
            preview.splice((i), 1);
            //update id's for all figures above of deleted one (i)
            for (let j = 0; j < el.length;  ++j) {
                preview[j].id = (j + 1);
            }

            //update gallery :
            //rm old gallery
            const projectRemoved = document.getElementById("figure_" + (i + 1));
            projectRemoved.remove();
            //recreate gallery with new preview
            console.log(preview);
        })
    }
}

