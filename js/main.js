'use strict';

var USER_NAMES = ['Маша', 'Даша', 'Света', 'Ира', 'Саша', 'Наташа', 'Ксюша'];
var USER_MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var AVATAR_COUNT = 6;
var PICTURE_COUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;

var pictureList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;

var bigPicture = document.querySelector('.big-picture');
var commentCount = bigPicture.querySelector('.social__comment-count');
var commentsLoader = bigPicture.querySelector('.comments-loader');
var bigPictureCommentsList = bigPicture.querySelector('.social__comments');
var bigPictureComment = bigPicture.querySelector('.social__comment');

var getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
};

var createPictureComments = function (amount) {
  var pictureComments = [];

  for (var i = 0; i < amount; i++) {
    pictureComments.push(
        {
          avatar: 'img/avatar-' + getRandomInteger(1, AVATAR_COUNT) + '.svg',
          message: USER_MESSAGES[getRandomInteger(0, USER_MESSAGES.length - 1)],
          name: USER_NAMES[getRandomInteger(0, USER_NAMES.length - 1)]
        }
    );
  }

  return pictureComments;
};

var pictureDescriptions = [];
var createPictureDescriptions = function () {
  for (var i = 0; i < PICTURE_COUNT; i++) {
    pictureDescriptions.push({url: 'photos/' + (i + 1) + '.jpg',
      description: 'Picture description ' + (i + 1),
      likes: getRandomInteger(LIKES_MIN, LIKES_MAX),
      comments: createPictureComments(getRandomInteger(0, USER_MESSAGES.length))});
  }
};

var createPicture = function (pictureDescription) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = pictureDescription.url;
  pictureElement.querySelector('.picture__likes').textContent = pictureDescription.likes;
  pictureElement.querySelector('.picture__comments').textContent = pictureDescription.comments.length;

  return pictureElement;
};

var hideBlock = function (block) {
  block.classList.add('hidden');
};

var showBlock = function (block) {
  block.classList.remove('hidden');
};

var fillContent = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictureDescriptions.length; i++) {
    fragment.appendChild(createPicture(pictureDescriptions[i]));
  }
  pictureList.appendChild(fragment);
};

var createBigPicture = function () {
  bigPicture.querySelector('.big-picture__img').firstElementChild.src = pictureDescriptions[0].url;
  bigPicture.querySelector('.likes-count').textContent = pictureDescriptions[0].likes;
  bigPicture.querySelector('.comments-count').textContent = pictureDescriptions[0].comments.length;
  bigPicture.querySelector('.social__caption').textContent = pictureDescriptions[0].description;

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictureDescriptions[0].comments.length - 1; i++) {
    var commentElement = bigPictureComment.cloneNode(true);

    commentElement.querySelector('.social__picture').src = pictureDescriptions[0].comments[i].avatar;
    commentElement.querySelector('.social__picture').alt = pictureDescriptions[0].comments[i].name;
    commentElement.querySelector('.social__text').textContent = pictureDescriptions[0].comments[i].message;
    fragment.appendChild(commentElement);
  }

  bigPictureCommentsList.appendChild(fragment);
  document.body.classList.add('modal-open');
};

createPictureDescriptions();
fillContent();
showBlock(bigPicture);
hideBlock(commentCount);
hideBlock(commentsLoader);
createBigPicture();
