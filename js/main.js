'use strict';

var USER_NAMES = ['Маша', 'Даша', 'Света', 'Ира', 'Саша', 'Наташа', 'Ксюша'];
var USER_MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var pictureList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;

var randomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
};

var createPictureComments = function (amount) {
  var pictureComments = [];

  for (var i = 0; i < amount; i++) {
    pictureComments.push({avatar: 'img/avatar-' + randomInteger(1, 6) + '.svg',
      message: USER_MESSAGES[randomInteger(0, 5)],
      name: USER_NAMES[randomInteger(0, 5)]});
  }

  return pictureComments;
};

var pictureDescriptions = [];
var createPictureDescriptions = function () {
  for (var i = 0; i < 25; i++) {
    pictureDescriptions.push({url: 'photos/' + (i + 1) + '.jpg',
      description: 'Picture description ' + (i + 1),
      likes: randomInteger(15, 200),
      comments: createPictureComments(randomInteger(1, 6))});
  }
};
createPictureDescriptions();

var createPicture = function (pictureDescription) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = pictureDescription.url;
  pictureElement.querySelector('.picture__likes').textContent = pictureDescription.likes;
  pictureElement.querySelector('.picture__comments').textContent = pictureDescription.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictureDescriptions.length; i++) {
  fragment.appendChild(createPicture(pictureDescriptions[i]));
}
pictureList.appendChild(fragment);
