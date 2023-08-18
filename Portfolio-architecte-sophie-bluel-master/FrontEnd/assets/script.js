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

//bool to check if page was already charged IOT to activate first button in green
let alreadyLogged = false;

//first call to create first project grid
createArticle(projects);
console.log(localStorage.getItem('userToken'));

//Create Projects elements_________________________________________________________________________________
function createArticle(el) {

    //For each el
    for (let i = 0; i < el.length; ++i) {

        //Create figure
        const articleFigure = document.createElement("figure");
        //Create image
        const figureImage = document.createElement("img");
        figureImage.src = el[i].imageUrl;
        //Create captioncca
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
    logoutButton.addEventListener("click", function () {
        //clear logged data in local storage then reload page
        localStorage.removeItem("logged");
        localStorage.removeItem('userToken');
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

//______________________|||||||create overlay && 1ST invoke||||||||____________________________

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
        createModaleAsync(preview).then(() => {
            console.log("All modale 1 construction and animation operations were successfull");
        }).catch(error => {
            console.log("There was an error : ", error)
        });
    } );
}

let spawnTester = {
    state: false,
}

//_____________||||||||||||||create 1st modale|||||||||||||____________________________________
async function createModaleAsync(el){
    //activate overlay
    overlay.classList.add("overlay_active");

    //create modale
    const centerContainer = document.createElement("div");
    centerContainer.classList.add("center");
    centerContainer.setAttribute("id", "modale_center-container");
    centerContainer.setAttribute('id', '1st_Modale');
    const modaleContainer = document.createElement("article");
    modaleContainer.classList.add("modale");
    if (spawnTester.state === false) {
        modaleContainer.classList.add("spawn_right");
        //console.log("spawnTester = " + spawnTester.state + " >> modale has spawn right");
    }
    if (spawnTester.state === true) {
        modaleContainer.classList.add("spawn_left");
        //console.log("spawnTester = " + spawnTester.state + " >> modale has spawn left");
    }
    const modaleXmark = document.createElement("i");
    modaleXmark.classList.add("fa-solid");
    modaleXmark.classList.add("fa-xmark");
    modaleXmark.classList.add("top_right");
    modaleXmark.classList.add("modale_icon");
    modaleXmark.classList.add("modale_xmark");
    const modaleTitle = document.createElement("h4");
    modaleTitle.innerHTML = "Galerie photo";
    const modaleGallery = document.createElement("div");
    modaleGallery.classList.add("modale_gallery");
    modaleGallery.classList.add("modale_elem-container");
    const modaleButtonContainer = document.createElement("div");
    modaleButtonContainer.classList.add("button_modale-container");
    const modaleButtonAdd = document.createElement("button");
    modaleButtonAdd.classList.add("button");
    modaleButtonAdd.classList.add("button_Selected");
    modaleButtonAdd.classList.add("button_modale")
    modaleButtonAdd.setAttribute('id', 'button_To-Next');
    modaleButtonAdd.innerHTML = "Ajouter une photo";
    const modaleButtonDelete = document.createElement("button");
    modaleButtonDelete.classList.add("button_delete");
    modaleButtonDelete.innerHTML = "Supprimer la galerie";

    overlay.after(centerContainer);
    centerContainer.prepend(modaleContainer);
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

    await createModaleGallery(preview);
    //console.log("All modale constructions ended");

    //first slide_in
    setTimeout(() => {
        slideInModale(modaleContainer);
    }, 50);
    //console.log("modale \"translate\" animation ended");

    closeModale(modaleXmark);
    deleteProjectModale(el);
    deleteAllProjectsModale();
    slideToNextModale();
}

//____________||||||Create 2nd modale||||||||_______________________________________

function createModale2(){
    //modify spawnTester state IOT prepare for slideBack fct
    spawnTester.state = true;
    console.log("All modale 2 construction and animation operations were successfull");

    //create modale 2
    //Center
    const center2Container = document.createElement("div");
    center2Container.classList.add("center");
    center2Container.setAttribute('id', '2nd_Modale');
    //Container
    const modale2Container = document.createElement("article");
    modale2Container.classList.add("modale");
    modale2Container.classList.add("spawn_right");
    modale2Container.setAttribute("id", "modale_2")
    //icons
    const modale2Arrow = document.createElement("i");
    modale2Arrow.classList.add("fa-solid");
    modale2Arrow.classList.add("fa-arrow-left");
    modale2Arrow.classList.add("top_left");
    modale2Arrow.classList.add("modale_icon");
    modale2Arrow.setAttribute("id", "modale_arrow")
    const modale2Xmark = document.createElement("i");
    modale2Xmark.classList.add("fa-solid");
    modale2Xmark.classList.add("fa-xmark");
    modale2Xmark.classList.add("top_right");
    modale2Xmark.classList.add("modale_icon");
    modale2Xmark.classList.add("modale_xmark");
    //Title
    const modale2Title = document.createElement("h4");
    modale2Title.innerHTML = "Ajout photo";
    const modale2Form = document.createElement("form");
    modale2Form.classList.add('modale2-form')
    modale2Form.setAttribute('action', '/upload');
    modale2Form.setAttribute('method', 'post');
    //Image downloader
    const modale2ImageInputContainer = document.createElement('div');
    modale2ImageInputContainer.classList.add('modale2-imageInputContainer');
    const modale2ImageInputImg = document.createElement('img');
    modale2ImageInputImg.classList.add('modale2-imageInputImg');
    modale2ImageInputImg.setAttribute('src', 'assets/icons/image-svgrepo-com.svg');
    modale2ImageInputImg.setAttribute('id', 'photoPreview');
    const modale2InputLabel = document.createElement('label');
    modale2InputLabel.setAttribute('id', 'modale2InputLabel');
    modale2InputLabel.setAttribute('for', 'modale2PhotoInput');
    modale2InputLabel.classList.add('modale2_photoLabel');
    modale2InputLabel.innerHTML = '<p>+ Ajouter photo</p>';
    const modale2ImageInputInp = document.createElement('input');
    modale2ImageInputInp.setAttribute('type', 'file');
    modale2ImageInputInp.setAttribute('id', 'modale2PhotoInput');
    modale2ImageInputInp.setAttribute('name', 'image');
    const modale2ImageInputText = document.createElement('p');
    modale2ImageInputText.innerHTML = 'jpg, png : 4mo max';
    modale2ImageInputText.setAttribute('id', 'modale2PhotoText');
   //input title
    const modale2InputContainerTitle = document.createElement('div');
    modale2InputContainerTitle.classList.add('inputContainer');
    const modale2TitleInputLabel = document.createElement('label');
    modale2TitleInputLabel.setAttribute('for', 'titleInput');
    modale2TitleInputLabel.setAttribute('id', 'titleInputLabel');
    modale2TitleInputLabel.classList.add('modale2_Label');
    modale2TitleInputLabel.innerHTML = 'Titre';
    const modale2TitleInput = document.createElement('input');
    modale2TitleInput.setAttribute('type', 'text');
    modale2TitleInput.setAttribute('id', 'titleInput')
    modale2TitleInput.classList.add('modale2_form-box');
    modale2TitleInput.setAttribute('required', '');
    //input category
    const modale2InputContainerSelect = document.createElement('div');
    modale2InputContainerSelect.classList.add('inputContainer');
    const modale2SelectLabel = document.createElement('label');
    modale2SelectLabel.setAttribute('for', 'modale2Select');
    modale2SelectLabel.setAttribute('id', 'modale2SelectLabel');
    modale2SelectLabel.classList.add('modale2_Label');
    modale2SelectLabel.innerHTML = 'Catégorie'
    const modale2Select = document.createElement('select');
    modale2Select.setAttribute('id', 'modale2Select')
    modale2Select.classList.add('modale2_form-box');
    modale2Select.setAttribute('name', 'chosenCategory');
    const option0 = document.createElement('option');
    const category1 = document.createElement('option');
    category1.setAttribute('value', '1');
    category1.innerHTML = ' Objets';
    const category2 = document.createElement('option');
    category2.setAttribute('value', '2');
    category2.innerHTML = ' Appartements';
    const category3 = document.createElement('option');
    category3.setAttribute('value', '3');
    category3.innerHTML = ' Hôtels & restaurants';
    //border
    const modale2Border = document.createElement('div');
    modale2Border.classList.add('modale2_border');
    //validation button
    const modale2ButtonValidate = document.createElement("button");
    modale2ButtonValidate.classList.add("button");
    modale2ButtonValidate.classList.add("button_Selected");
    modale2ButtonValidate.classList.add("button_modale");
    modale2ButtonValidate.innerHTML = "Valider";
    modale2ButtonValidate.setAttribute('id', 'modale2_Button');
    modale2ButtonValidate.setAttribute('type', 'button');

    //append
    overlay.after(center2Container);
    center2Container.prepend(modale2Container);
    modale2Container.appendChild(modale2Arrow);
    modale2Container.appendChild(modale2Xmark);
    modale2Container.appendChild(modale2Title);
    modale2Container.appendChild(modale2Form);
    modale2Form.appendChild(modale2ImageInputContainer);
    modale2ImageInputContainer.appendChild(modale2ImageInputImg);
    modale2ImageInputContainer.appendChild(modale2InputLabel);
    modale2ImageInputContainer.appendChild(modale2ImageInputInp);
    modale2ImageInputContainer.appendChild(modale2ImageInputText);
    modale2Form.appendChild(modale2InputContainerTitle);
    modale2InputContainerTitle.appendChild(modale2TitleInputLabel);
    modale2InputContainerTitle.appendChild(modale2TitleInput);
    modale2Form.appendChild(modale2InputContainerSelect);
    modale2InputContainerSelect.appendChild(modale2SelectLabel);
    modale2InputContainerSelect.appendChild(modale2Select);
    modale2Select.appendChild(option0);
    modale2Select.appendChild(category1);
    modale2Select.appendChild(category2);
    modale2Select.appendChild(category3);
    modale2Form.appendChild(modale2Border);
    modale2Form.appendChild(modale2ButtonValidate);

    //first slide_in
    setTimeout(() => {
        slideInModale(modale2Container);
    }, 50);

    closeModale(modale2Xmark);
    //slide to next >>> save, close and preview
    slideToNextModale();
    slideBackModale();
    newProjectPreview(preview);
    activateButton();
}

//___________||||||||||||||close modale|||||||||||||||||____________________________
function closeModale(el) {
    //redeclare center div & modale locally
    const centerContainer = document.querySelector(".center");
    //check center existence
    if(centerContainer) {
        el.addEventListener("click", function(event) {
            //check if event.target is in .xmark
            if (event.target.classList.contains("modale_xmark") || event.target.classList.contains("button") ) {
                closeEventModaleAsync();
                console.log("All operations to close modales were successfull");
            }

            async function closeEventModaleAsync() {
                //hide overlay by switching classes fm active to notActive
                overlay.classList.add("overlay_notActive");
                overlay.classList.remove("overlay_active")

                //slide modale
                slideOutRightModale(centerContainer);

                //then erase modale
                setTimeout(() => {
                    centerContainer.remove();
                }, 1000);
                //recreate new gallery updated
                const gallery = document.querySelector(".gallery");
                gallery.innerHTML = "";
                createArticle(preview);

                //reset spawn tester
                spawnTester.state = false;
            }
        });
    }
}


//________||||||||||||||||Delete projects||||||||||||||||___________________________
const trash = [];

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
            console.log("Project " + (i + 1) + " was deleted");
        })
    }
}

function deleteAllProjectsModale() {
    const modaleButtonDelete = document.querySelector(".button_delete");
    const modaleGallery = document.querySelector(".modale_gallery");
    modaleButtonDelete.addEventListener("click", function() {
        modaleGallery.innerHTML = "";
        preview = [];
    });
}

//____________|||||||Slide modale||||||||||___________________________________________
function slideInModale(el) {
    setTimeout(() => {
        el.classList.add("translate_in");
        el.classList.remove("translate_out-left");
        el.classList.remove("translate_out-right");
    }, 50);
}

function slideOutLeftModale(el) {
    el.classList.remove("translate_in");
    el.classList.add("translate_out-left");

    setTimeout(() => {
        el.remove();
        console.log("Modale 1 was succesfully removed");
    }, 1000);
}

function slideOutRightModale(el) {
    el.classList.remove("translate_in");
    el.classList.add("translate_out-right");
}
function slideToNextModale() {

    //declare button
    const buttonToNextModale = document.getElementById('button_To-Next');
    const centerContainer = document.querySelector(".center");

    //add event listener click on button
    //>> call function slide out
    if (buttonToNextModale) {
        buttonToNextModale.addEventListener("click", async function() {

            slideOutLeftModale(centerContainer);
            createModale2();
        });
    }
}
function slideBackModale() {

    //redclare DOM elem and target them
    const modale2Arrow = document.getElementById("modale_arrow");
    const modale2Container = document.getElementById("modale_2");
    const centerContainer = document.querySelector(".center");


    modale2Arrow.addEventListener("click", function() {
        //move 2nd modfale to right
        slideOutRightModale(centerContainer);
        //remake 1st modale
        createModaleAsync(preview);
        setTimeout(() => {
            //spawn tester to intial state after creation of modale 1
            spawnTester.state = false;
            console.log("spawnTester = " + spawnTester + " >> initial state again");
        }, 1000);
        //rm 2nd modale && 1st center container bc remake
        //timeout to let play animation
        setTimeout(() => {
            modale2Container.remove();
            centerContainer.remove();
        }, 1000);
    })
}
//_____________||||||||modale2 button ON/OFF|||||||||___________________________
function activateButton() {
    const button = document.getElementById('modale2_Button');
    const input = document.getElementById('titleInput');
    const select = document.getElementById('modale2Select');
    const file = document.getElementById('modale2PhotoInput');

    //conditions IOT activate button
    if (button) {
        if (input.value && select.value && file.files[0]) {
            button.classList.remove('button_notActive');
            button.classList.add('button_Selected');
        } else {
            button.classList.add('button_notActive');
            button.classList.remove('button_Selected');
        }
    }

    //recheck conditions for each change
    file.addEventListener('change', function() {
        activateButton();
    })
    input.addEventListener('change', function() {
        activateButton();
    })
    select.addEventListener('change', function() {
        activateButton();
    })
}

//_____________||||||||Preview image in modale 2||||||||||||____________________
//create jsonData
const jsonData = {
    id: '',
    title: '',
    imageUrl: '',
    category: '',
    userId: localStorage.getItem('userId'),
}

let dataStored = false;

function newProjectPreview(el) {
    const photo= document.getElementById('modale2PhotoInput');
    const photoPreview = document.getElementById('photoPreview');
    const input = document.getElementById('titleInput');
    const select = document.getElementById('modale2Select');
    const button = document.getElementById('modale2_Button');
    let base64String = '';
    jsonData.id = (el.length + 1);

    //console.log(preview);
    //console.log('jsonData' + localStorage.getItem('items'));

    //1st condition : choose file and recall
    if (photo) {
        photo.addEventListener('change', function() {
            console.log('preview function fires');
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    //display preview
                    photoPreview.src = event.target.result;
                    photoPreview.classList.add('file');
                    document.getElementById('modale2InputLabel').classList.add('fileSelected');
                    document.getElementById('modale2PhotoInput').classList.add('fileSelected');
                    document.getElementById('modale2PhotoText').classList.add('fileSelected');
                    document.querySelector('.modale2-imageInputContainer').classList.add('fileSelectedContainer');

                    //convert to base 64
                    base64String = event.target.result;

                    //update objects
                    jsonData.imageUrl = base64String;

                    checkNewProjectConditions();
                }
                reader.readAsDataURL(file);
            }
        });
    }

    //2nd condition : fill in the blank and recall
    if (input) {
        input.addEventListener('change', function() {
            //update objects
            jsonData.title = input.value;
            checkNewProjectConditions();
        });
    }

    //3rd condition : fill in the blank and recall
    if (select) {
        select.addEventListener('change', function() {
           //update objects
           jsonData.category = select.value;
           checkNewProjectConditions();
        });
    }

    function checkNewProjectConditions() {
        if (dataStored) {
            return;
        }

        //when all inputs are selected >> Store data
        if (base64String !== '' && jsonData.title !== '' && jsonData.category !== '') {

            dataStored = true;

            //store jsonData :
            let savedItems = JSON.parse(localStorage.getItem('items')) || [];
            savedItems.push(jsonData);
            localStorage.setItem('items', JSON.stringify(savedItems));

            //push preview data
            el.push(jsonData);

            console.log(JSON.parse(localStorage.getItem('items'))[0]);
            closeModale(button);

        } else {
            newProjectPreview(el);
        }
    }
}

//__________||||||||POST new project||||||||_______________________________________

//erase new project with instagram icon (dev purpose)
const instagram = document.getElementById('instagram');
instagram.addEventListener('click', function () {
   localStorage.removeItem('items');
   console.log('items removed');
});

//print new project
console.log(JSON.parse(localStorage.getItem('items'))[0]);

//POST when button is clicked
const button = document.getElementById('saveButton');
button.addEventListener('click', function(event) {
    event.preventDefault();
    postNewProject();
});

//New project logic
function postNewProject() {

    const data = JSON.parse(localStorage.getItem('items'));
    const userToken = localStorage.getItem('userToken');
    const url = `http://localhost:5678/api/works`;

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
    });

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data[0])
    }).then( res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('No response');
        }
    }).then( data => {
        console.log('post request successfull', data);
        window.location.reload(true);
    }).catch(error => {
        console.error(error);
    })
}

//Check data size

const data = JSON.parse(localStorage.getItem('items'));
function getJsonPayloadSizeInBytes(jsonObj) {
    const jsonString = JSON.stringify(jsonObj);
    let byteSize = 0;

    // UTF-8 encoding
    for (let i = 0; i < jsonString.length; i++) {
        const charCode = jsonString.charCodeAt(i);

        if (charCode <= 0x7F) {
            byteSize += 1;
        } else if (charCode <= 0x7FF) {
            byteSize += 2;
        } else if (charCode <= 0xFFFF) {
            byteSize += 3;
        } else {
            byteSize += 4;
        }
    }

    return byteSize;
}

//check data and token integrity

let newPreview = projects.map(el => el);

newPreview.push(data[0]);
console.log(newPreview);





