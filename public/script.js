const initialCards = [];
const infoButton = document.querySelector('.user-info__button');
const popupClose = document.querySelector('.popup__close');
const iconLike = document.querySelector('.place-card__like-icon');
const addCardButton = document.querySelector('.popup__button');
const placesList = document.querySelector('.places-list');
const editButton = document.querySelector('.edit__button');
const editPopup = document.getElementById('editPopup');
const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job'); 
const avatar = document.querySelector('.user-info__photo');
const form = document.forms.new;
const name = form.elements.name;
const link = form.elements.link;

const editForm = document.forms.editForm;
const editName = editForm.elements.name;
const editInfo = editForm.elements.info;

editName.value = userName.textContent;
editInfo.value = userJob.textContent;

/**
 * можно улучшить
 * 
 * Хорошо когда код сгруппирован в функции
 * так можно лучше понимать какие действий происходят
 * например можно вынести в updateProfile запись имени и должности
 * и сделать два параметра - так выйдет обновлять данные профиля
 * после редактирования и при загрузке одной функцией
 */

class Api {
  constructor(url, token) {
    this.url = url;
    this.token = token;
  }

  getInitialCards() {
  return fetch(`${this.url}/cards`, 
  { 
   headers: {
    authorization: `${this.token}`
  }
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  })

  .catch((err)=> {
    console.log(err);
  });
  }

  dataLoading(){
    return fetch(`${this.url}/users/me`,
    {
    headers: {
      authorization: `${this.token}`
    }      
    })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  })

  .catch((err)=> {
    console.log(err);
  });    
  }  
  profileEditSave(){
       return fetch(`${this.url}/users/me`,
    {
    method: 'PATCH',
    headers: {
      authorization: `${this.token}`,
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
      name: userName.textContent,
      about: userJob.textContent
      })
    })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  })

  .catch((err)=> {
    console.log(err);
  });  
  }
}

const api = new Api('http://95.216.175.5/cohort3', '549369e6-22a5-4f49-bf55-d055fc07237e');

api.getInitialCards().then((result) => {
      for(let i = 0; i<result.length; i++){
        initialCards.push({
          'name': result[i]['name'],
          'link': result[i]['link']
        })
      }
      /**
       * Можно улучшить
       * 
       * Стоит сразу передавать данные в класс без промежуточных массивов
       * new CardList(placesList, result)
       * 
       * Для циклов удобнее использовать for of
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
       * это позволяет сократить запись цикла и получить более понятные имена переменных
       */
new CardList(placesList, initialCards)
})

api.dataLoading().then((result) => {
  userName.textContent = result.name;
  userJob.textContent = result.about;
  editName.value = userName.textContent; //загрузка имени с сервера
  editInfo.value = userJob.textContent; //загрузка информации с сервера
  avatar.style.backgroundImage = `url(${result.avatar})`; //загрузка аватара с сервера 

  /**
   * Работа выполнена хорошо
   * 
   * Данные для надежности можно проверять перед отрисовкой
   * if (result.name && result.about) {}
   * так можно избежать ошибок при отсутствии полей на сервере
   * в случае с массивом будет правильнее проверять наличие элементов
   * перед запуском цикла result && result.length > 0
   */
  })

class Card {
  constructor(name, link){
  this.cardElement = this.create(name, link);
  this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
  this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
  this.cardElement.querySelector('.place-card__image').addEventListener('click', function(event){
    if(event.target.matches('.place-card__image')){
      popupImage.applyImage(event.target.style.backgroundImage);
    }
  });

  }
    create (nameValue, linkValue) {

    let iconDelete = document.createElement('button');
    iconDelete.classList.add('place-card__delete-icon');


    let cardDescription = document.createElement('div');
    cardDescription.classList.add('place-card__description');

    let iconLike = document.createElement('button');
    iconLike.classList.add('place-card__like-icon');

    let cardsContainer = document.createElement('div');
    cardsContainer.classList.add('place-card');

    let cardName = document.createElement('h3');
    cardName.classList.add('place-card__name');    
    cardName.textContent = nameValue;
        

    let cardImage = document.createElement('div');
    cardImage.classList.add('place-card__image');
    cardImage.style.backgroundImage = `url(${linkValue})`;


    cardImage.appendChild(iconDelete);
    cardsContainer.appendChild(cardImage);
    cardsContainer.appendChild(cardDescription);
    cardDescription.appendChild(cardName);
    cardDescription.appendChild(iconLike);
    
    return cardsContainer;

  }
  // добавление лайка (метод like)
  like(event){
    event.target.classList.toggle('place-card__like-icon_liked');

  }
  remove(){
    placesList.removeChild(this.parentElement.parentElement);
  }

}

class CardList{
  constructor(container, array){
    this.container = container;
    this.array = array;
    this.render();
  }
  //добавление картинки в конец массива
  addCard(name, link){
    const { cardElement } = new Card(name, link);
    this.array.push({name, link});
    this.container.appendChild(cardElement);
  }
    render(){
    this.array.forEach((el) => this.addCard(el.name, el.link)); 
  }

}



class Popup{
  constructor(popupElement){
    this.popupElement = popupElement;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.popupElement.closest('.root').querySelector('.popup__close').addEventListener('click', this.close);


  }
  open(){
    this.popupElement.classList.add('popup_is-opened');

  }
  close(){
    this.popupElement.classList.remove('popup_is-opened');
    form.reset();
    addCardButton.classList.remove('popup__button_active');
  }
  applyImage(event){
 
    let popup = document.createElement('div');
    popup.classList.add('popup');

    let popupContent = document.createElement('div');
    popupContent.classList.add('popup__image');
   
              
    let popupImage = document.createElement('img');
    popupImage.classList.add('popup__image-background');
    popupImage.style.backgroundImage = event;
          
    let popupClose = document.createElement('img');
    popupClose.setAttribute('src', "./images/close.svg");
    popupClose.classList.add('popup__close');

              
    popupContent.appendChild(popupImage);
    popupContent.appendChild(popupClose);
    popup.appendChild(popupContent);            
    document.body.appendChild(popup);

    popup.classList.add('popup_is-opened');
    //закрытие попап с картинкой
    popupClose.addEventListener('click', function(){
    popup.classList.remove('popup_is-opened');

  });
  
  }
}

class PopupEdit extends Popup{
  constructor(popupElement, button){
    super(popupElement);
    this.button = button;
    this.change();
    this.button.addEventListener('click', this.open);
    this.editClose = document.getElementById('editClose');
    this.editClose.addEventListener('click', this.close);
  }
  change(){
    this.popupElement.addEventListener('submit', function(event){
    event.preventDefault();

      if (editName.value.length !== 0 && editInfo.value.length !== 0) {
        userName.textContent = editName.value;
        userJob.textContent =  editInfo.value;

        api.profileEditSave().then(result => console.log(result));

        editPopup.classList.remove('popup_is-opened');
        changeProfileButton.removeAttribute('disabled');
      }
      else {
        changeProfileButton.setAttribute('disabled', true);
      }

    });
  }

  close(){  
    this.popupElement.classList.remove('popup_is-opened');
    editName.value = userName.textContent;
    editInfo.value = userJob.textContent;
    resetError(editName);
    resetError(editInfo);
    changeProfileButton.removeAttribute('disabled');
    changeProfileButton.classList.add('popup__button_active');   
    
  }
}
class PopupCard extends Popup{
  constructor(popupElement, button){
    super(popupElement);
    this.button = button;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.popupElement.closest('.root').querySelector('.popup__close').addEventListener('click', this.close);
    this.button.addEventListener('click', this.open);
  }
}


const popup = new PopupCard(document.querySelector('.popup'), infoButton);
const popupImage = new Popup(document.querySelector('.popup'));
const popupEdit = new PopupEdit(editPopup, editButton);
const cardList = new CardList(document.querySelector('.places-list'),initialCards);

// Изменение кнопки "добавить карточку", от количества введеных символов

const popupForm = document.querySelector('.popup__form');

popupForm.addEventListener('input', function() {
  

    if (name.value.length !== 0 && link.value.length !== 0){
    addCardButton.classList.add('popup__button_active');

    } 
    else {
      addCardButton.classList.remove('popup__button_active');

    }
  
});


//слушатель события
form.addEventListener('submit', function(event){

  event.preventDefault();

  if (name.value.length === 0 || link.value.length === 0){
    addCardButton.setAttribute('disabled', true);

  } else {

    cardList.addCard(form.elements.name.value,form.elements.link.value);
    popup.close();

  }
  addCardButton.removeAttribute('disabled');
  addCardButton.classList.remove('popup__button_active');

});


//предупреждение о заполнение полей

editName.addEventListener('input', handleValidate);
editInfo.addEventListener('input', handleValidate);



function handleValidate(event) {
  resetError(event.target);
  validate(event.target);
}

changeProfileButton.classList.add('popup__button_active');


function validate(element) {

  const errorName = document.querySelector('#error-name');
  const errorInfo = document.querySelector('#error-info');

  /* Можно лучше: код проверок дублируется для обоих полей. Лучше постараться вынести код проверки
  в отдельную функцию */
  if (editName.value.length === 0) {
    errorName.textContent = 'Это обязательное поле!';
    errorName.parentNode.classList.add('input-container__invalid');
    changeProfileButton.classList.remove('popup__button_active');
    changeProfileButton.setAttribute('disabled', true);

  } else if (editName.value.length < 2  || editName.value.length > 30) {
    errorName.textContent = 'Должно быть от 2 до 30 символов!';
    errorName.parentNode.classList.add('input-container__invalid');
    changeProfileButton.classList.remove('popup__button_active');
    changeProfileButton.setAttribute('disabled', true);

  } else {
    errorName.textContent = '';
    changeProfileButton.classList.add('popup__button_active');
    changeProfileButton.removeAttribute('disabled');
  }

  if (editInfo.value.length === 0) {
    errorInfo.textContent = 'Это обязательное поле!';
    errorInfo.parentNode.classList.add('input-container__invalid');
    changeProfileButton.classList.remove('popup__button_active');
    changeProfileButton.setAttribute('disabled', true);

  } else if (editInfo.value.length < 2  || editInfo.value.length > 30) {
    errorInfo.textContent = 'Должно быть от 2 до 30 символов!';
    errorInfo.parentNode.classList.add('input-container__invalid');
    changeProfileButton.classList.remove('popup__button_active');
    changeProfileButton.setAttribute('disabled', true);

  } else {
    errorInfo.textContent = '';

  }
}


function resetError(element) {
  element.parentNode.classList.remove('input-container__invalid');
  element.textContent = '';
}


