module.exports = {
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
        modifyButton.addEventListener("click", function () {
            //always invoke with preview to prevent reinvoking wrong array after project deletion
            //preview = projects duplication
            createModaleAsync(preview).then(() => {
                console.log("All modale construction and animation operations were successfull");
            }).catch(error => {
                console.log("There was an error : ", error)
            });
        });
    }

    let spawnTester = {
        state: false,
    }
    console.log("spawnTester = " + spawnTester.state);

    //_____________||||||||||||||create 1st modale|||||||||||||____________________________________
    async function createModaleAsync(el) {
        //activate overlay
        overlay.classList.add("overlay_active");

        //create modale
        const centerContainer = document.createElement("div");
        centerContainer.classList.add("center");
        centerContainer.setAttribute("id", "modale_center-container");
        const modaleContainer = document.createElement("article");
        modaleContainer.classList.add("modale");
        if (spawnTester.state === false) {
            modaleContainer.classList.add("spawn_right");
            console.log("spawnTester = " + spawnTester.state + " >> modale has spawn right");
        }
        if (spawnTester.state === true) {
            modaleContainer.classList.add("spawn_left");
            console.log("spawnTester = " + spawnTester.state + " >> modale has spawn left");
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
        console.log("All modale constructions ended");

        //first slide_in
        setTimeout(() => {
            slideInModale(modaleContainer);
        }, 50);
        console.log("modale \"translate\" animation ended");

        closeModale(modaleXmark);
        deleteProjectModale(el);
        deleteAllProjectsModale();
        slideToNextModale();
    }

    //____________||||||Create 2nd modale||||||||_______________________________________

    function createModale2() {
        //modify spawnTester state IOT prepare for slideBack fct
        spawnTester.state = true;
        console.log("modale 2 complete, && spawnTester = " + spawnTester.state);

        //create modale 2
        const center2Container = document.createElement("div");
        center2Container.classList.add("center");
        const modale2Container = document.createElement("article");
        modale2Container.classList.add("modale");
        modale2Container.classList.add("spawn_right");
        modale2Container.setAttribute("id", "modale_2")
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
        const modale2Title = document.createElement("h4");
        modale2Title.innerHTML = "Ajout photo";
        const modale2ElemContainer = document.createElement("div");
        modale2ElemContainer.classList.add("modale_elem-container");

        //add image input
        //add title input
        //add category select

        const modale2ButtonContainer = document.createElement("div");
        modale2ButtonContainer.classList.add("button_modale-container");
        const modale2ButtonValidate = document.createElement("button");
        modale2ButtonValidate.classList.add("button");
        modale2ButtonValidate.classList.add("button_Selected");
        modale2ButtonValidate.classList.add("button_modale2")
        modale2ButtonValidate.innerHTML = "Valider";

        overlay.after(center2Container);
        center2Container.prepend(modale2Container);
        modale2Container.appendChild(modale2Arrow);
        modale2Container.appendChild(modale2Xmark);
        modale2Container.appendChild(modale2Title);
        modale2Container.appendChild(modale2ElemContainer);
        modale2Container.appendChild(modale2ButtonContainer);
        modale2ButtonContainer.appendChild(modale2ButtonValidate);

        console.log("All modale 2 constructions ended");

        //first slide_in
        setTimeout(() => {
            slideInModale(modale2Container);
        }, 50);
        console.log("modale \"translate-in\" animation ended");

        closeModale(modale2Xmark);
        //slide to next >>> save, close and preview
        slideToNextModale();
        slideBackModale();
    }

    //___________||||||||||||||close modale|||||||||||||||||____________________________
    function closeModale(el) {
        //redeclare center div & modale locally
        const centerContainer = document.querySelector(".center");
        //check center existence
        if (centerContainer) {
            el.addEventListener("click", function (event) {
                //check if event.target is in .xmark
                if (event.target.classList.contains("modale_xmark")) {
                    closeEventModaleAsync();
                    console.log("All operations to closing modales were successfull");
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
                }
            });
        }
    }


    //________||||||||||||||||Delete projects||||||||||||||||___________________________
    //make new array to preview :
    const trash = [];
    //console.log(preview);

    //delete function : event listener on each trash icon
    //>> splice new Arr
    //>>callback create modal
    function deleteProjectModale(el) {
        for (let i = 0; i < el.length; ++i) {
            //ex : trash[0] == #trash_1; trash[1] == #trash_2 ...; trash[i] == #trash_(i + 1)
            trash[i] = document.getElementById("trash_" + (i + 1));
            trash[i].addEventListener("click", function () {

                //update preview[]
                preview.splice((i), 1);
                //update id's for all figures above of deleted one (i)
                for (let j = 0; j < el.length; ++j) {
                    preview[j].id = (j + 1);
                }

                //update gallery :
                //rm old gallery
                const projectRemoved = document.getElementById("figure_" + (i + 1));
                projectRemoved.remove();
                console.log("Project id : " + (i + 1) + " was deleted");
            })
        }
    }

    function deleteAllProjectsModale() {
        const modaleButtonDelete = document.querySelector(".button_delete");
        const modaleGallery = document.querySelector(".modale_gallery");
        modaleButtonDelete.addEventListener("click", function () {
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
        const buttonToNextModale = document.querySelector(".button_modale");
        const centerContainer = document.querySelector(".center");

        //add event listener click on button
        //>> call function slide out
        if (buttonToNextModale) {
            buttonToNextModale.addEventListener("click", async function () {

                slideOutLeftModale(centerContainer);
                createModale2();
            });
        }
    }

    function slideBackModale() {

        //redclare DOM elem and target them
        const modale2Arrow = document.getElementById("modale_arrow");
        //const modaleContainer = document.querySelector(".modale");
        const modale2Container = document.getElementById("modale_2");
        const centerContainer = document.querySelector(".center");


        modale2Arrow.addEventListener("click", function () {
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
};
