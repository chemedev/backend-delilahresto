'use strict';

(async () => {
	let dishesCount = 0;
	let order = [];
	let headers = {
		'Content-Type': 'application/json',
		Authorization: '',
	};
	//! Load Dishes
	async function loadDishes() {
		const dishesDiv = document.querySelector('.dishes');
		let dishes = await fetch('http://localhost:3000/products').then((res) =>
			res.json()
		);
		let child = '';
		dishes.forEach((dish) => {
			child += `
		<div class="dishes__dish" data-name="${dish.description}">
			<img class="dishes__dish__img" src="${dish.picture}" alt="" />
			<div>
				<p class="dishes__dish__name">${dish.description}</p>
				<p class="dishes__dish__price">$${dish.price}</p>
			</div>
			<i class="material-icons material-icons--add">add_circle</i>
		</div>
	`;
		});
		dishesDiv.innerHTML = child;
	}

	await loadDishes();

	//! DOM manipulation
	const header = document.querySelector('header');
	const main = document.querySelector('main');
	const mainDivs = document.querySelectorAll('.mainDivs');
	const btnLoginLogin = document.querySelector('#loginLogin');
	const btnLoginSignup = document.querySelector('#loginSignup');
	const btnSignupCreate = document.querySelector('#signupCreate');
	const btnSignupCancel = document.querySelector('#signupCancel');
	const btnAdd = document.querySelectorAll('.material-icons--add');
	const wrapperFixed = document.querySelector('.wrapper--fixed');
	const btnOrderAdd = document.querySelector('#orderAdd');
	const btnConfirm = document.querySelector('#detailConfirm');
	const btnDelete = document.querySelectorAll('.material-icons--cancel');
	const btnFollow = document.querySelector('#successfulFollow');
	const statusCircles = document.querySelectorAll('.circle');
	const statusItems = document.querySelectorAll('.status__item');

	const loginEmail = document.querySelector('#loginEmail');
	const loginPassword = document.querySelector('#loginPassword');

	const username = document.querySelector('#username');
	const fullname = document.querySelector('#fullname');
	const email = document.querySelector('#email');
	const mobile = document.querySelector('#mobile');
	const address = document.querySelector('#address');
	const password = document.querySelector('#password');

	//! Check if already logged
	if (localStorage.token) {
		headers.Authorization = localStorage.token;
		fetch('http://localhost:3000/signin', {
			method: 'POST',
			body: JSON.stringify({ token: localStorage.getItem('token') }),
			headers,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res[0].err) {
					if (res[0].err === 'You are already logged.') {
						mainDivs.forEach((div) => div.classList.remove('visually-hidden'));
						mainDivs[0].classList.add('visually-hidden');
						mainDivs[1].classList.add('visually-hidden');
						mainDivs[2].classList.remove('visually-hidden');
						mainDivs[3].classList.add('visually-hidden');
						mainDivs[4].classList.add('visually-hidden');
						toggleClass(header, 'homepageHeader');
						toggleClass(main, 'homepageMain');
					} else if (res[0].err === 'Invalid username or password.') {
						console.log(res[0].err);
					} else if (res[0].err.message) {
						localStorage.removeItem('token');
						console.log(res[0].err.message);
					}
				}
			});
	}

	//! Generic class changer function
	function toggleClass(e, c) {
		e.classList.toggle(c);
	}

	//! Header => Homepage
	header.addEventListener('click', () => (location.href = '/'));

	//! Main Sections SHOW/HIDE
	btnLoginLogin.addEventListener('click', () => {
		const data = {
			username: loginEmail.value,
			password: loginPassword.value,
		};

		if (loginEmail.validity.valid && loginPassword.validity.valid) {
			fetch('http://localhost:3000/signin', {
				method: 'POST',
				body: JSON.stringify(data),
				headers,
			})
				.then((res) => res.json())
				.then((res) => {
					let data = res[0];
					if (data.token) {
						localStorage.setItem('username', loginEmail.value);
						localStorage.setItem('fullname', data.fullname);
						localStorage.setItem('address', data.address);
						localStorage.setItem('token', data.token);
						headers.Authorization = res.token;
						toggleClass(mainDivs[0], 'visually-hidden');
						toggleClass(mainDivs[2], 'visually-hidden');
						toggleClass(header, 'homepageHeader');
						toggleClass(main, 'homepageMain');
					} else {
						localStorage.removeItem('token');
						headers.Authorization = '';
						console.log(data.err);
					}
				});
		}
	});

	btnLoginSignup.addEventListener('click', () => {
		toggleClass(mainDivs[0], 'visually-hidden');
		toggleClass(header, 'homepageHeader');
		toggleClass(main, 'homepageMain');
		toggleClass(mainDivs[1], 'visually-hidden');
	});

	btnSignupCreate.addEventListener('click', () => {
		const data = {
			username: username.value,
			fullname: fullname.value,
			email: email.value,
			phone: mobile.value, //! CHANGE TO MOBILE
			address: address.value,
			password: password.value,
		};

		if (
			username.validity.valid &&
			fullname.validity.valid &&
			email.validity.valid &&
			mobile.validity.valid &&
			address.validity.valid &&
			password.validity.valid
		) {
			fetch('http://localhost:3000/signup', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((res) => res.json())
				.then((res) => {
					if (res[0].token) {
						toggleClass(mainDivs[1], 'visually-hidden');
						toggleClass(mainDivs[2], 'visually-hidden');
						toggleClass(header, 'homepageHeader');
						toggleClass(main, 'homepageMain');
						localStorage.setItem('token', res[0].token);
						headers.Authorization = res.token;
					}
				});
		}
	});

	btnSignupCancel.addEventListener('click', () => {
		toggleClass(mainDivs[0], 'visually-hidden');
		toggleClass(header, 'homepageHeader');
		toggleClass(main, 'homepageMain');
		toggleClass(mainDivs[1], 'visually-hidden');
	});

	btnOrderAdd.addEventListener('click', () => {
		fetch(`http://localhost:3000/users/${localStorage.getItem('username')}, {
			method: 'GET',
			body: '',
			${headers}
		}`)
			.then((res) => res.json())
			.then((res) => console.log(res));
		const orderDiv = document.querySelector('#orderDishes');
		const dishesDiv = Array.from(document.querySelector('.dishes').children);
		let child = '';
		dishesDiv.forEach((e) => {
			order.forEach((ordered) => {
				if (ordered === e.getAttribute('data-name')) child += e.outerHTML;
			});
		});
		orderDiv.innerHTML = child;

		toggleClass(mainDivs[2], 'visually-hidden');
		toggleClass(mainDivs[3], 'visually-hidden');
	});

	btnConfirm.addEventListener('click', () => {
		toggleClass(mainDivs[3], 'visually-hidden');
		toggleClass(mainDivs[4], 'visually-hidden');
	});

	btnFollow.addEventListener('click', () => {
		toggleClass(mainDivs[4], 'visually-hidden');
		toggleClass(mainDivs[3], 'visually-hidden');

		const button = mainDivs[3].querySelector('.wrapper');
		toggleClass(button, 'visually-hidden');

		const icons = mainDivs[3].querySelectorAll('.material-icons');
		icons.forEach((icon) => {
			toggleClass(icon, 'visually-hidden');
		});

		const statusTitle = document.querySelector('.statusTitle');
		toggleClass(statusTitle, 'visually-hidden');
		const statusDiv = document.querySelector('.status');
		toggleClass(statusDiv, 'visually-hidden');
	});

	//! Listeners => add/remove dishes
	for (const btn of btnAdd) {
		//! PRODUCT NAME ON EACH DIV
		let name = btn.parentElement.getAttribute('data-name');

		btn.addEventListener('click', () => {
			if (btn.innerHTML == 'add_circle') {
				btn.innerHTML = 'done_outline';
				dishesCount++;
				//! ADD PRODUCT NAME TO ORDER
				order.push(name);
			} else {
				btn.innerHTML = 'add_circle';
				//! REMOVE PRODUCT NAME FROM ORDER
				order.splice(
					order.findIndex((e) => e === name),
					1
				);
				dishesCount--;
			}
			if (
				dishesCount == 0 ||
				wrapperFixed.classList.contains('visually-hidden')
			)
				toggleClass(wrapperFixed, 'visually-hidden');
		});
	}

	for (const btn of btnDelete) {
		btn.addEventListener('click', () => btn.parentNode.remove());
	}

	//! Listeners => change status on click

	statusCircles.forEach((circle, index) => {
		circle.addEventListener('click', () => {
			statusItems.forEach((e) => e.classList.remove('status__item--active'));
			toggleClass(statusItems[index], 'status__item--active');
		});
	});
})();
