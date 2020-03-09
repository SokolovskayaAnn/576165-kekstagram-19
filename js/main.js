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
var MAX_AMOUNT_OF_COMMENTS = 5;
var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';
var BASE = 10;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var SCALE_STEP = 25;
var PERCENT = 100;
var COEFFICIENT_PHOBOS_EFFECT = 3;
var COEFFICIENT_HEAT_EFFECT = 2;
var STEP_HEAT_EFFECT = 1;

var pictureList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;

var uploadFile = pictureList.querySelector('#upload-file');
var uploadCancel = pictureList.querySelector('#upload-cancel');
var editingImageWindow = pictureList.querySelector('.img-upload__overlay');
var hashTagsString = pictureList.querySelector('.text__hashtags');
var uploadPictureDescription = pictureList.querySelector('.text__description');

var scaleControlls = pictureList.querySelector('.img-upload__scale');
var scaleControllValue = scaleControlls.querySelector('.scale__control--value');
var uploadForm = pictureList.querySelector('.img-upload__form');
var uploadPicturePreview = pictureList.querySelector('.img-upload__preview');
var uploadPicturePreviewImage = pictureList.querySelector('.img-upload__preview-image');
var effectLevel = pictureList.querySelector('.effect-level');
var effectLevelLine = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
var effectLevelValue = effectLevel.querySelector('.effect-level__value');
var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
var effectsList = pictureList.querySelector('.effects__list');

var bigPicture = document.querySelector('.big-picture');
var commentCount = bigPicture.querySelector('.comments-count');
var commentsLoader = bigPicture.querySelector('.comments-loader');
var bigPictureCommentsList = bigPicture.querySelector('.social__comments');
var bigPictureComment = bigPicture.querySelector('.social__comment');
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

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
  if (evt.key === ESC_KEY && document.activeElement !== hashTagsString && document.activeElement !== uploadPictureDescription) {
    closeEditingImageWindow();
  }
};

var onBigPictureWindowEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    closeBigPictureWindow();
  }
};

var onUploadPictureSubmit = function () {
  checkHashTagsValidity();
};

var onEffectChange = function (evt) {
  if (evt.target.matches('input')) {
    changeEffect(evt);
  }
};

var onScaleChange = function (evt) {
  if (evt.target.matches('.scale__control--smaller')) {
    decreaseScale();
  } else if (evt.target.matches('.scale__control--bigger')) {
    increaseScale();
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
  uploadForm.addEventListener('submit', onUploadPictureSubmit);
  effectsList.addEventListener('click', onEffectChange);
  scaleControlls.addEventListener('click', onScaleChange);
  effectLevelPin.addEventListener('mouseup', onEffectLevelPinMouseUp);
};

var closeEditingImageWindow = function () {
  uploadFile.value = '';
  hashTagsString.value = '';
  uploadPictureDescription.value = '';
  scaleControllValue.setAttribute('value', '100%');
  uploadPicturePreview.setAttribute('style', '');
  editingImageWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEditingImageWindowEscPress);
  uploadForm.removeEventListener('submit', onUploadPictureSubmit);
  effectsList.removeEventListener('click', onEffectChange);
  scaleControlls.removeEventListener('click', onScaleChange);
  effectLevelPin.removeEventListener('mouseup', onEffectLevelPinMouseUp);
};

var checkHashTagsValidity = function () {
  var hashTags = hashTagsString.value.toLowerCase().split(' ');
  var regExpNumberLetter = '[^#A-Za-zА-Яа-я0-9]';
  var flagValidity = false;
  if (hashTags.length > MAX_AMOUNT_OF_HASHTAGS) {
    hashTagsString.setCustomValidity('Вы не можете указать больше 5 хэш-тэгов!');
  } else {
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].indexOf('#', 1) !== -1) {
        hashTagsString.setCustomValidity('Хэш-теги должны разделяться пробелом!');
        flagValidity = true;
      } else if (hashTags[i].charAt(0) !== '#') {
        hashTagsString.setCustomValidity('Хэш-тег должен начинаться с символа #!');
        flagValidity = true;
      } else if (hashTags[i] === '#') {
        hashTagsString.setCustomValidity('Хэш-тег не может состоять только из #!');
        flagValidity = true;
      } else if (hashTags[i].match(regExpNumberLetter) !== null) {
        hashTagsString.setCustomValidity('Текст хэш-тега должен состоять только из букв и чисел и не может содержать пробел, спец. символы и т.д.!');
        flagValidity = true;
      } else if (hashTags[i].length > MAX_LENGTH_OF_HASHTAG) {
        hashTagsString.setCustomValidity('Максимальная длина одного хэш-тега, включая символ # - 20 символов!');
        flagValidity = true;
      } else if (hashTags.indexOf(hashTags[i], i + 1) !== -1) {
        hashTagsString.setCustomValidity('Нельзя использовать одинаковые хэш-теги: #ХэшТег = #хештег!');
        flagValidity = true;
      }
    }
    if (!flagValidity) {
      hashTagsString.setCustomValidity('');
    }
  }
};

var changePictureScale = function (step) {
  scaleControllValue.setAttribute('value', parseInt(scaleControllValue.value, BASE) + step + '%');
  uploadPicturePreview.setAttribute('style', 'transform: scale(' +
  parseInt(scaleControllValue.value, BASE) / PERCENT + ');');
};

var increaseScale = function () {
  if (parseInt(scaleControllValue.value, BASE) + SCALE_STEP <= MAX_SCALE) {
    changePictureScale(SCALE_STEP);
  } else {
    scaleControllValue.setAttribute('value', MAX_SCALE + '%');
  }
};

var decreaseScale = function () {
  if (parseInt(scaleControllValue.value, BASE) - SCALE_STEP >= MIN_SCALE) {
    changePictureScale(SCALE_STEP * -1);
  } else {
    scaleControllValue.setAttribute('value', MIN_SCALE + '%');
  }
};

var changeEffectLevel = function () {
  var pinPosition = Math.round(effectLevelPin.offsetLeft / effectLevelLine.offsetWidth * PERCENT);
  switch (uploadPicturePreviewImage.classList[1]) {
    case 'effects__preview--none':
      uploadPicturePreviewImage.setAttribute('style', '');
      break;
    case 'effects__preview--chrome':
      uploadPicturePreviewImage.setAttribute('style', 'filter: grayscale(' + pinPosition / PERCENT + ');');
      effectLevelValue.setAttribute('value', pinPosition / PERCENT);
      break;
    case 'effects__preview--sepia':
      uploadPicturePreviewImage.setAttribute('style', 'filter: sepia(' + pinPosition / PERCENT + ');');
      effectLevelValue.setAttribute('value', pinPosition / PERCENT);
      break;
    case 'effects__preview--marvin':
      uploadPicturePreviewImage.setAttribute('style', 'filter: invert(' + pinPosition + '%);');
      effectLevelValue.setAttribute('value', pinPosition);
      break;
    case 'effects__preview--phobos':
      uploadPicturePreviewImage.setAttribute('style', 'filter: blur(' + pinPosition / PERCENT * COEFFICIENT_PHOBOS_EFFECT + 'px);');
      effectLevelValue.setAttribute('value', pinPosition / PERCENT * COEFFICIENT_PHOBOS_EFFECT);
      break;
    case 'effects__preview--heat':
      uploadPicturePreviewImage.setAttribute('style', 'filter: brightness(' + (pinPosition / PERCENT * COEFFICIENT_HEAT_EFFECT + STEP_HEAT_EFFECT) + ');');
      effectLevelValue.setAttribute('value', pinPosition / PERCENT * COEFFICIENT_HEAT_EFFECT + STEP_HEAT_EFFECT);
      break;
    default:
      uploadPicturePreviewImage.setAttribute('style', '');
      effectLevelValue.setAttribute('value', '100');
  }
  effectLevelPin.setAttribute('style', 'left: ' + pinPosition + '%');
  effectLevelDepth.setAttribute('style', 'width: ' + pinPosition + '%');
};

var changeEffect = function (evt) {
  effectLevelValue.setAttribute('value', '100');
  effectLevelPin.setAttribute('style', 'left: 100%');
  effectLevelDepth.setAttribute('style', 'width: 100%');
  uploadPicturePreviewImage.classList.remove('effects__preview--none', 'effects__preview--chrome',
      'effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos',
      'effects__preview--heat');
  uploadPicturePreviewImage.setAttribute('style', '');
  if (evt.target.value === 'none') {
    effectLevel.classList.add('visually-hidden');
  } else {
    effectLevel.classList.remove('visually-hidden');
  }
  uploadPicturePreviewImage.classList.add('effects__preview--' + evt.target.value);
};

var openBigPictureWindow = function (evt) {
  createBigPicture(evt);

  if (commentCount.textContent <= MAX_AMOUNT_OF_COMMENTS) {
    hideBlock(commentsLoader);
  } else {
    showBlock(commentsLoader);
  }

  showBlock(bigPicture);
  bigPicture.addEventListener('keydown', onBigPictureWindowEscPress);
};

var closeBigPictureWindow = function () {
  hideBlock(bigPicture);
  document.body.classList.remove('modal-open');
  bigPicture.removeEventListener('keydown', onBigPictureWindowEscPress);
};

var createBigPicture = function (element) {
  var bigPictureNumber = element.src.slice(element.src.lastIndexOf(('/')) + 1, element.src.lastIndexOf(('.'))) - 1;

  bigPicture.querySelector('.big-picture__img').firstElementChild.src = pictureDescriptions[bigPictureNumber].url;
  bigPicture.querySelector('.likes-count').textContent = pictureDescriptions[bigPictureNumber].likes;
  bigPicture.querySelector('.comments-count').textContent = pictureDescriptions[bigPictureNumber].comments.length;
  bigPicture.querySelector('.social__caption').textContent = pictureDescriptions[bigPictureNumber].description;

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictureDescriptions[bigPictureNumber].comments.length; i++) {
    var commentElement = bigPictureComment.cloneNode(true);

    commentElement.querySelector('.social__picture').src = pictureDescriptions[bigPictureNumber].comments[i].avatar;
    commentElement.querySelector('.social__picture').alt = pictureDescriptions[bigPictureNumber].comments[i].name;
    commentElement.querySelector('.social__text').textContent = pictureDescriptions[bigPictureNumber].comments[i].message;
    fragment.appendChild(commentElement);
  }

  while (bigPictureCommentsList.firstChild) {
    bigPictureCommentsList.removeChild(bigPictureCommentsList.firstChild);
  }

  bigPictureCommentsList.appendChild(fragment);
  document.body.classList.add('modal-open');
};

createPictureDescriptions();
fillContent();

pictureList.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    openBigPictureWindow(evt.target.firstElementChild);
  }
});

pictureList.addEventListener('click', function (evt) {
  openBigPictureWindow(evt.target);
});

bigPictureCancel.addEventListener('click', function () {
  closeBigPictureWindow();
});

uploadFile.addEventListener('change', function () {
  openEditingImageWindow();
});

uploadCancel.addEventListener('click', function () {
  closeEditingImageWindow();
});
