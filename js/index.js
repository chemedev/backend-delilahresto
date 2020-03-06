'use strict';

let dishesCount = 0;

//! DOM manipulation
const header = document.querySelector('header');
const main = document.querySelector('main');
const mainDivs = document.querySelectorAll('.mainDivs');
const btnLoginLogin = document.querySelector('#loginLogin');
const btnLoginSignup = document.querySelector('#loginSignup');
const btnSignupCancel = document.querySelector('#signupCancel');
const btnAdd = document.querySelectorAll('.material-icons');
const wrapperFixed = document.querySelector('.wrapper--fixed');
const btnOrderAdd = document.querySelector('#orderAdd');

//! Generic class changer function
function toggleClass(e, c) {
	e.classList.toggle(c);
}

//! Header => Homepage
header.addEventListener('click', () => (location.href = 'index.html'));

btnLoginLogin.addEventListener('click', () => {
	toggleClass(mainDivs[0], 'visually-hidden');
	toggleClass(mainDivs[2], 'visually-hidden');
	toggleClass(header, 'homepageHeader');
	toggleClass(main, 'homepageMain');

});

btnLoginSignup.addEventListener('click', () => {
	toggleClass(mainDivs[0], 'visually-hidden');
	toggleClass(header, 'homepageHeader');
	toggleClass(main, 'homepageMain');
	toggleClass(mainDivs[1], 'visually-hidden');
});

btnSignupCancel.addEventListener('click', () => {
	toggleClass(mainDivs[0], 'visually-hidden');
	toggleClass(header, 'homepageHeader');
	toggleClass(main, 'homepageMain');
	toggleClass(mainDivs[1], 'visually-hidden');
});

btnOrderAdd.addEventListener('click', () => {
	toggleClass(mainDivs[2], 'visually-hidden');
	toggleClass(mainDivs[3], 'visually-hidden');
});

//! Listeners => add/remove dishes
for (const btn of btnAdd) {
	btn.addEventListener('click', () => {
		if (btn.innerHTML == 'add_circle') {
			btn.innerHTML = 'done_outline';
			dishesCount++;
		} else {
			btn.innerHTML = 'add_circle';
			dishesCount--;
		}
		if (dishesCount == 0 || wrapperFixed.classList.contains('visually-hidden'))
			toggleClass(wrapperFixed, 'visually-hidden');
	});
}
