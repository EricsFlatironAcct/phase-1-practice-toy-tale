document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn")
  const toyFormContainer = document.querySelector(".container")
  addBtn.addEventListener("click", () => {
    // hide & seek with the form ternary style
    toyFormContainer.style.display === "block" ? toyFormContainer.style.display = "none" : toyFormContainer.style.display = "block" 
  })

  //Fetch toys for initialization
  fetch(`http://localhost:3000/toys`)
  .then(resp => resp.json())
  .then(deck => {
  //Sends each toy found in the database to add to the collection
    for(toy of deck){addToy(toy)}
  })
  //Adds a toy to the collection
  function addToy(toy){
    //create the HTML elements and attributes
    const newToy = document.createElement('div')
    newToy.classList.add("card")
    const cardH2 = document.createElement('h2')
    const cardImg = document.createElement('img')
    const cardLikes = document.createElement('p')
    const cardButton = document.createElement('button')
    cardH2.innerHTML = toy.name
    console.log(toy.image)
    cardImg.src = toy.image
    cardImg.classList.add("toy-avatar")
    cardLikes.innerHTML = `${toy.likes} likes`
    cardButton.id = toy.id
    cardButton.classList.add("like-btn")
    cardButton.textContent = "Like"
    cardButton.addEventListener('click', addLike)
    newToy.append(cardH2, cardImg, cardLikes, cardButton)
    //adds card to the toy-collection
    document.querySelector('#toy-collection').appendChild(newToy)
  }
  //Increase likes
  function addLike(){
    const cardInfo = {
      name: this.parentNode.querySelector('h2').textContent,
      likes: parseInt(this.parentNode.querySelector('p').textContent, 10)+1, //Raises the value of likes by 1 here
      image: this.parentNode.querySelector('img').src,
      id: this.id
    }
    const patchData = {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(cardInfo)
    }
    //Patches the object on the server
    fetch(`http://localhost:3000/toys/${this.id}`, patchData)
    .then(resp => resp.json())
    .then(data => this.parentNode.querySelector('p').textContent = `${data.likes} likes`) //updates the webpage when patch is successful
  }

  //adds a new toy through the add toy form
  const addToyForm = document.querySelector('form')
  addToyForm.addEventListener('submit', createToy=>{
    createToy.preventDefault()
    const newToy ={
      name: createToy.target[0].value,
      image: createToy.target[1].value,
      likes: 0
    }
    const postData = {
      method: "POST",
      headers:{
        "Content-Type" : "application/json",
        "Accept": "application/json"
      },
      body:  JSON.stringify(newToy)
    }
    fetch(`http://localhost:3000/toys/`, postData)
    .then(resp => resp.json())
    .then(toyObj => addToy(toyObj)) //Adds the new toy to the html doc when post is successful
  })
})
