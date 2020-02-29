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

var MAX_LENGTH_OF_HASHTAG = 20;
var MAX_AMOUNT_OF_HASHTAGS = 5;
var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';
var BASE = 10;
var MIN_SCALE = 25;
var MAX_SCALE = 100;

var pictureList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;

var uploadFile = pictureList.querySelector('#upload-file');
var uploadCancel = pictureList.querySelector('#upload-cancel');
var editingImageWindow = pictureList.querySelector('.img-upload__overlay');
var hashTags = pictureList.querySelector('.text__hashtags');
var uploadPictureDescription = pictureList.querySelector('.text__description');

var scaleControllSmaller = pictureList.querySelector('.scale__control--smaller');
var scaleControllBigger = pictureList.querySelector('.scale__control--bigger');
var scaleControllValue = pictureList.querySelector('.scale__control--value');
var uploadPicturePrewiew = pictureList.querySelector('.img-upload__preview');
var scaleStep = 25;
var effectLevel = pictureList.querySelector('.effect-level');
var effectLevelLine = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
var effectLevelValue = effectLevel.querySelector('.effect-level__value');
var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
var effectsList = pictureList.querySelector('.effects__list');

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

var onEditingImageWindowEscPress = function (evt) {
  if (evt.key === ESC_KEY && document.activeElement !== hashTags && document.activeElement !== uploadPictureDescription) {
    closeEditingImageWindow();
  }
};

var onHashTagInputEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    checkHashTagsValidity();
  }
};

var onEffectRadioClick = function (evt) {
  if (evt.target.matches('input')) {
    changeEffect(evt);
  }
};

var onEffectLevelPinMouseUp = function () {
  changeEffectLevel();
};

var openEditingImageWindow = function () {
  editingImageWindow.classList.remove('hidden');
  document.body.classList.add('modal-open');
  effectLevel.classList.add('visually-hidden');
  document.addEventListener('keydown', onEditingImageWindowEscPress);
  document.addEventListener('keydown', onHashTagInputEnterPress);
  effectsList.addEventListener('click', onEffectRadioClick);
  effectLevelPin.addEventListener('mouseup', onEffectLevelPinMouseUp);
};

var closeEditingImageWindow = function () {
  uploadFile.value = '';
  hashTags.value = '';
  uploadPictureDescription.value = '';
  editingImageWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEditingImageWindowEscPress);
  document.removeEventListener('keydown', onHashTagInputEnterPress);
  effectsList.removeEventListener('click', onEffectRadioClick);
  effectLevelPin.removeEventListener('mouseup', onEffectLevelPinMouseUp);
};

var checkHashTagsValidity = function () {
  var arrayOfHashTags = hashTags.value.toLowerCase().split(' ');
  if (arrayOfHashTags.length > MAX_AMOUNT_OF_HASHTAGS) {
    hashTags.setCustomValidity('Вы не можете указать больше 5 хэш-тэгов!');
  } else {
    for (var i = 0; i < arrayOfHashTags.length; i++) {
      if (arrayOfHashTags[i].indexOf('#', 1) !== -1) {
        hashTags.setCustomValidity('Хэш-теги должны разделяться пробелом!');
      } else if (arrayOfHashTags[i].match('^[#]') === null) {
        hashTags.setCustomValidity('Хэш-тег должен начинаться с символа #!');
      } else if (arrayOfHashTags[i].length === 1 && arrayOfHashTags[i] === '#') {
        hashTags.setCustomValidity('Хэш-тег не может состоять только из #!');
      } else if (arrayOfHashTags[i].match('[^#A-Za-zА-Яа-я0-9]') !== null) {
        hashTags.setCustomValidity('Текст хэш-тега должен состоять только из букв и чисел и не может содержать пробел, спец. символы и т.д.!');
      } else if (arrayOfHashTags[i].length > MAX_LENGTH_OF_HASHTAG) {
        hashTags.setCustomValidity('Максимальная длина одного хэш-тега, включая символ # - 20 символов!');
      } else if (arrayOfHashTags.indexOf(arrayOfHashTags[i], i + 1) !== -1) {
        hashTags.setCustomValidity('Нельзя использовать одинаковые хэш-теги: #ХэшТег = #хештег!');
      } else {
        hashTags.setCustomValidity('');
      }
    }
  }
};

var changePictureScale = function () {
  uploadPicturePrewiew.firstElementChild.setAttribute('style', 'transform: scale(' +
  parseInt(scaleControllValue.value, BASE) / 100 + ');');
};

var increaseScale = function () {
  if (parseInt(scaleControllValue.value, BASE) + scaleStep <= MAX_SCALE) {
    scaleControllValue.setAttribute('value', parseInt(scaleControllValue.value, BASE) + scaleStep + '%');
  } else {
    scaleControllValue.setAttribute('value', MAX_SCALE + '%');
  }
  changePictureScale();
};

var decreaseScale = function () {
  if (parseInt(scaleControllValue.value, BASE) - scaleStep >= MIN_SCALE) {
    scaleControllValue.setAttribute('value', parseInt(scaleControllValue.value, BASE) - scaleStep + '%');
  } else {
    scaleControllValue.setAttribute('value', MIN_SCALE + '%');
  }
  changePictureScale();
};

var changeEffectLevel = function () {
  var pinPosition = Math.round(effectLevelPin.offsetLeft / effectLevelLine.offsetWidth * 100);
  switch (uploadPicturePrewiew.firstElementChild.className) {
    case 'effects__preview--none':
      uploadPicturePrewiew.firstElementChild.setAttribute('style', '');
      break;
    case 'effects__preview--chrome':
      uploadPicturePrewiew.firstElementChild.setAttribute('style', 'filter: grayscale(' + pinPosition / 100 + ');');
      effectLevelValue.setAttribute('value', pinPosition / 100);
      break;
    case 'effects__preview--sepia':
      uploadPicturePrewiew.firstElementChild.setAttribute('style', 'filter: sepia(' + pinPosition / 100 + ');');
      effectLevelValue.setAttribute('value', pinPosition / 100);
      break;
    case 'effects__preview--marvin':
      uploadPicturePrewiew.firstElementChild.setAttribute('style', 'filter: invert(' + pinPosition + '%);');
      effectLevelValue.setAttribute('value', pinPosition);
      break;
    case 'effects__preview--phobos':
      uploadPicturePrewiew.firstElementChild.setAttribute('style', 'filter: blur(' + pinPosition / 100 * 3 + 'px);');
      effectLevelValue.setAttribute('value', pinPosition / 100 * 3);
      break;
    case 'effects__preview--heat':
      uploadPicturePrewiew.firstElementChild.setAttribute('style', 'filter: brightness(' + (pinPosition / 100 * 2 + 1) + ');');
      effectLevelValue.setAttribute('value', pinPosition / 100 * 2 + 1);
      break;
    default:
      uploadPicturePrewiew.firstElementChild.setAttribute('style', '');
      effectLevelValue.setAttribute('value', '100');
  }
  effectLevelPin.setAttribute('style', 'left: ' + pinPosition + '%');
  effectLevelDepth.setAttribute('style', 'width: ' + pinPosition + '%');
};

var changeEffect = function (evt) {
  effectLevelValue.setAttribute('value', '80');
  effectLevelPin.setAttribute('style', 'left: 80%');
  effectLevelDepth.setAttribute('style', 'width: 80%');
  uploadPicturePrewiew.firstElementChild.setAttribute('class', 'effects__preview--none');
  uploadPicturePrewiew.firstElementChild.setAttribute('style', '');
  if (evt.target.value === 'none') {
    effectLevel.classList.add('visually-hidden');
  } else {
    effectLevel.classList.remove('visually-hidden');
  }
  uploadPicturePrewiew.firstElementChild.setAttribute('class', 'effects__preview--' + evt.target.value);
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

uploadFile.addEventListener('change', function () {
  openEditingImageWindow();
});

uploadCancel.addEventListener('click', function () {
  closeEditingImageWindow();
});

scaleControllBigger.addEventListener('click', function () {
  increaseScale();
});

scaleControllSmaller.addEventListener('click', function () {
  decreaseScale();
});
