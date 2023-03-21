document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    if (toyFormContainer.style.display === "block") {
      toyFormContainer.style.display = "none";
    } else {
      toyFormContainer.style.display = "block";
    }
  });

  //Fetch toys
  fetch(`http://localhost:3000/toys`)
  .then(resp => {
    //turns JSON to object  
    return resp.json();
  })
  .then(deck => {
  //Add toy to card
    for(toy of deck){
     addToy(toy)
    }
  })
  //Adds a toy to the collection
  function addToy(toy){
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
    newToy.appendChild(cardH2)
    newToy.appendChild(cardImg)
    newToy.appendChild(cardLikes)
    newToy.appendChild(cardButton)
    document.querySelector('#toy-collection').appendChild(newToy)
  }
  //Increase likes
  function addLike(){
    const cardInfo = {
      name: this.parentNode.querySelector('h2').textContent,
      likes: parseInt(this.parentNode.querySelector('p').textContent, 10)+1,
      image: this.parentNode.querySelector('img').src,
      id: this.id
    }
    const postData = {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(cardInfo)
    }
    fetch(`http://localhost:3000/toys/${this.id}`, postData)
    .then(resp => resp.json())
    .then(data => {
      this.parentNode.querySelector('p').textContent = `${data.likes} likes`
    })
    .catch(e=>console.log(e))
  }

  //adds a new toy through the add toy feature
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
    .then(toyObj => {
      addToy(toyObj)
    })
  })
});
