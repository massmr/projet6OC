//Front end script for Sophie Bluel Portfolio website

//GET projects and save data in localStorage
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

createArticle(projects);
console.log(projects);

//Create Projects elements
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
        console.log(projects[i].imageUrl);

        //Append Child
        const gallery = document.querySelector(".gallery");
        gallery.appendChild(articleFigure);
        articleFigure.appendChild(figureImage);
        articleFigure.appendChild(figureCaption);
    }
}
