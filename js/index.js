'use strict';

const title = document.querySelector('h1');
const main = document.querySelectorAll('.mainDivs');
const btnLoginLogin = document.querySelector('#loginLogin');
const btnLoginSignup = document.querySelector('#loginSignup');
const btnSignupCancel = document.querySelector('#signupCancel');
const btnAdd = document.querySelectorAll('.material-icons');

function toggleClass(e, c) {
	e.classList.toggle(c);
}

title.addEventListener('click', () => (location.href = 'index.html'));

btnLoginLogin.addEventListener('click', () => {
	toggleClass(main[0], 'visually-hidden');
	toggleClass(main[2], 'visually-hidden');

	toggleClass(title, 'homepageSize');
});

btnLoginSignup.addEventListener('click', () => {
	toggleClass(main[0], 'visually-hidden');
	toggleClass(title, 'homepageSize');
	toggleClass(main[1], 'visually-hidden');
});

btnSignupCancel.addEventListener('click', () => {
	toggleClass(main[0], 'visually-hidden');
	toggleClass(title, 'homepageSize');
	toggleClass(main[1], 'visually-hidden');
});

for (const btn of btnAdd) {
	btn.addEventListener('click', () => {
		if (btn.innerHTML == 'add_circle') {
			btn.innerHTML = 'done_outline';
		} else btn.innerHTML = 'add_circle';
	});
}
