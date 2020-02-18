'use strict';

var USER_NAMES = ['Маша', 'Даша', 'Света', 'Ира', 'Саша', 'Наташа', 'Ксюша'];
var USER_MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var pictureList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;

var bigPicture = document.querySelector('.big-picture');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');
var bigPictureCommentsList = document.querySelector('.social__comments').children;

var getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
};

var createPictureComments = function (amount) {
  var pictureComments = [];

  for (var i = 0; i < amount; i++) {
    pictureComments.push(
        {
          avatar: 'img/avatar-' + getRandomInteger(1, 6) + '.svg',
          message: USER_MESSAGES[getRandomInteger(0, USER_MESSAGES.length)],
          name: USER_NAMES[getRandomInteger(0, USER_NAMES.length)]
        }
    );
  }

  return pictureComments;
};

var pictureDescriptions = [];
var createPictureDescriptions = function () {
  for (var i = 0; i < 25; i++) {
    pictureDescriptions.push({url: 'photos/' + (i + 1) + '.jpg',
      description: 'Picture description ' + (i + 1),
      likes: getRandomInteger(15, 200),
      comments: createPictureComments(getRandomInteger(1, 6))});
  }
};

var createPicture = function (pictureDescription) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = pictureDescription.url;
  pictureElement.querySelector('.picture__likes').textContent = pictureDescription.likes;
  pictureElement.querySelector('.picture__comments').textContent = pictureDescription.comments.length;

  return pictureElement;
};

var fillContent = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictureDescriptions.length; i++) {
    fragment.appendChild(createPicture(pictureDescriptions[i]));
  }
  pictureList.appendChild(fragment);
};

createPictureDescriptions();
fillContent();

bigPicture.classList.remove('hidden');
commentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');
document.body.classList.add('modal-open');

bigPicture.querySelector('.big-picture__img').firstElementChild.src = pictureDescriptions[0].url;
bigPicture.querySelector('.likes-count').textContent = pictureDescriptions[0].likes;
bigPicture.querySelector('.comments-count').textContent = pictureDescriptions[0].comments.length;
bigPicture.querySelector('.social__caption').textContent = pictureDescriptions[0].description;

for (var i = 0; i < bigPictureCommentsList.length; i++) {
  var bigPictureComment = bigPictureCommentsList[i];
  bigPictureComment.querySelector('.social__picture').src = pictureDescriptions[0].comments[i].avatar;
  bigPictureComment.querySelector('.social__picture').alt = pictureDescriptions[0].comments[i].name;
  bigPictureComment.querySelector('.social__text').textContent = pictureDescriptions[0].comments[i].message;
}
