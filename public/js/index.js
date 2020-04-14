'use strict';

(async () => {
	let dishesCount = 0;
	let order = [];
	let headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
	};

	//! Load Dishes
	async function loadDishes() {
		try {
			const dishesDiv = document.querySelector('.dishes');
			if (localStorage.getItem('token')) {
				let dishes = await fetch(
					'https://mechell-delilah.herokuapp.com/products',
					{
						headers: {
							Authorization: `bearer ${localStorage.getItem('token')}`, //! HARDCODED HARDCODED HARDCODED
						},
					}
				).then((res) => res.json());
				let child = '';
				dishes.forEach((dish) => {
					child += `
						<div class="dishes__dish" data-id="${dish.id}" data-name="${dish.description}">
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
		} catch (e) {
			return console.log(e);
		}
	}

	await loadDishes();

	//! DOM manipulation
	var header = document.querySelector('header');
	var main = document.querySelector('main');
	var mainDivs = document.querySelectorAll('.mainDivs');
	var btnLoginLogin = document.querySelector('#loginLogin');
	var btnLoginSignup = document.querySelector('#loginSignup');
	var btnSignupCreate = document.querySelector('#signupCreate');
	var btnSignupCancel = document.querySelector('#signupCancel');
	var btnAdd = document.querySelectorAll('.material-icons--add');
	var wrapperFixed = document.querySelector('.wrapper--fixed');
	var btnOrderAdd = document.querySelector('#orderAdd');
	var btnConfirm = document.querySelector('#detailConfirm');
	var btnDelete = document.querySelectorAll('.material-icons--cancel');
	var btnFollow = document.querySelector('#successfulFollow');
	var statusCircles = document.querySelectorAll('.circle');
	var statusItems = document.querySelectorAll('.status__item');

	var loginEmail = document.querySelector('#loginEmail');
	var loginPassword = document.querySelector('#loginPassword');

	var username = document.querySelector('#username');
	var fullname = document.querySelector('#fullname');
	var email = document.querySelector('#email');
	var mobile = document.querySelector('#mobile');
	var address = document.querySelector('#address');
	var password = document.querySelector('#password');

	var favoritesDiv = document.querySelector('.favorites');

	async function getFavorites() {
		let username = localStorage.getItem('username');
		let favs = await fetch(
			`https://mechell-delilah.herokuapp.com/users/${username}/favorites`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		).then((res) => res.json());

		let child = '';

		if (favs.length != 0) {
			favs.forEach((fav) => {
				child += `
			<div class="card">
				<div class="card__top" style="background-image: url('${fav.picture}')">
					<h2 class="card__title">${fav.description}</h2>
				</div>
				<div class="card__foot">
					<span>$${fav.price}</span>
					<input class="card__input" type="button" value="Añadir" />
				</div>
			</div>
		`;
			});
			favoritesDiv.innerHTML = child;
		} else {
			favoritesDiv.classList.add('visually-hidden');
			document.getElementById('h5Favs').classList.add('visually-hidden');
		}
	}
	if (localStorage.getItem('username')) getFavorites();

	var orderDiv = document.querySelector('#orderDishes');

	var btnDropdown = document.querySelector('.dropdown__btn');

	//! Check if already logged
	if (localStorage.token) {
		if (localStorage.ordered === 'true') {
			mainDivs.forEach((div) => div.classList.remove('visually-hidden'));
			mainDivs[0].classList.add('visually-hidden');
			mainDivs[1].classList.add('visually-hidden');
			mainDivs[2].classList.add('visually-hidden');
			mainDivs[3].classList.add('visually-hidden');
			mainDivs[4].classList.remove('visually-hidden');
			toggleClass(header, 'homepageHeader');
			toggleClass(main, 'homepageMain');
		} else {
			// 	fetch('https://mechell-delilah.herokuapp.com/signin', {
			// 		method: 'POST',
			// 		body: JSON.stringify({ token: localStorage.getItem('token') }),
			// 		headers,
			// 	})
			// 		.then((res) => res.json())
			// 		.then((res) => {
			// 			if (res[0].err) {
			// 				if (res[0].err === 'You are already logged.') {
			mainDivs.forEach((div) => div.classList.remove('visually-hidden'));
			mainDivs[0].classList.add('visually-hidden');
			mainDivs[1].classList.add('visually-hidden');
			mainDivs[2].classList.remove('visually-hidden');
			mainDivs[3].classList.add('visually-hidden');
			mainDivs[4].classList.add('visually-hidden');
			toggleClass(header, 'homepageHeader');
			toggleClass(main, 'homepageMain');
			// 				} else if (res[0].err === 'Invalid username or password.') {
			// 					console.log(res[0].err);
			// 				} else if (res[0].err.message) {
			// 					localStorage.removeItem('token');
			// 					console.log(res[0].err.message);
			// 				}
			// 			}
			// 		});
		}
	}

	//! Generic class changer function
	function toggleClass(e, c) {
		e.classList.toggle(c);
	}

	//! Header => Homepage
	header.addEventListener('click', () => (location.href = '/'));

	//! Main Sections SHOW/HIDE

	//? LOGIN
	btnLoginLogin.addEventListener('click', () => {
		const data = {
			username: loginEmail.value,
			password: loginPassword.value,
		};

		if (loginEmail.validity.valid && loginPassword.validity.valid) {
			let auth = '';
			fetch('https://mechell-delilah.herokuapp.com/signin', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: headers,
			})
				.then((res) => {
					auth = res.headers.get('Authorization');
					return res.json();
				})
				.then((data) => {
					if (auth) {
						let token = auth.split(' ')[1];
						localStorage.setItem('address', data[0].address);
						localStorage.setItem('fullname', data[0].fullname);
						localStorage.setItem('token', token);
						localStorage.setItem('username', data[0].username);
						headers.Authorization = `bearer ${token}`;
						toggleClass(mainDivs[0], 'visually-hidden');
						toggleClass(mainDivs[2], 'visually-hidden');
						toggleClass(header, 'homepageHeader');
						toggleClass(main, 'homepageMain');
					} else {
						localStorage.removeItem('token');
						headers.Authorization = '';
						console.log(data[0].err);
					}
				});
		}
	});

	//? REGISTRARSE
	btnLoginSignup.addEventListener('click', () => {
		toggleClass(mainDivs[0], 'visually-hidden');
		toggleClass(header, 'homepageHeader');
		toggleClass(main, 'homepageMain');
		toggleClass(mainDivs[1], 'visually-hidden');
	});

	//? CREAR CUENTA
	btnSignupCreate.addEventListener('click', async () => {
		let auth = '';
		const data = {
			username: username.value,
			fullname: fullname.value,
			email: email.value,
			mobile: mobile.value,
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
			fetch('https://mechell-delilah.herokuapp.com/users', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: headers,
			})
				.then((res) => {
					auth = res.headers.get('Authorization');
					return res.json();
				})
				.then((data) => {
					if (auth) {
						let token = auth.split(' ')[1];
						localStorage.setItem('address', data[0].address);
						localStorage.setItem('fullname', data[0].fullname);
						localStorage.setItem('token', token);
						headers.Authorization = `bearer ${token}`;
						toggleClass(mainDivs[1], 'visually-hidden');
						toggleClass(mainDivs[2], 'visually-hidden');
						toggleClass(header, 'homepageHeader');
						toggleClass(main, 'homepageMain');
					}
				});
		}
	});

	//? CANCELAR
	btnSignupCancel.addEventListener('click', () => {
		toggleClass(mainDivs[0], 'visually-hidden');
		toggleClass(header, 'homepageHeader');
		toggleClass(main, 'homepageMain');
		toggleClass(mainDivs[1], 'visually-hidden');
	});

	//? AGREGAR A MI PEDIDO
	btnOrderAdd.addEventListener('click', () => {
		const options = document.querySelectorAll('.dropdown__content span');
		options.forEach((option) =>
			option.addEventListener(
				'click',
				(e) => (btnDropdown.children[0].innerHTML = e.target.innerHTML)
			)
		);
		const spanAddress = document.querySelector('#spanAddress');
		const spanTotal = document.querySelector('#spanTotal');
		fetch('https://mechell-delilah.herokuapp.com/users/mechell', {
			//! HARDCODED
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				localStorage.setItem('id', data[0].id);
				spanAddress.innerHTML = data[0].address;
			});
		const dishesDiv = Array.from(document.querySelector('.dishes').children);
		let child = '';
		let total = 0;
		dishesDiv.forEach((e) => {
			order.forEach((ordered) => {
				if (ordered === e.getAttribute('data-name')) {
					let individualPrice = e.children[1].children[1].innerHTML.replace(
						'$',
						''
					);
					total += parseFloat(individualPrice);
					child += e.outerHTML;
				}
			});
		});
		spanTotal.innerHTML = `Total: <b>$${total}.00</b>`;
		orderDiv.innerHTML = child;

		toggleClass(mainDivs[2], 'visually-hidden');
		toggleClass(mainDivs[3], 'visually-hidden');
	});

	//? CONFIRMAR PEDIDO
	btnConfirm.addEventListener('click', () => {
		localStorage.setItem('ordered', 'true');
		let orderItems = [];
		let payment = btnDropdown.children[0].innerHTML;
		switch (payment) {
			case 'Efectivo':
				payment = 10;
				break;
			case 'Débito':
				payment = 11;
				break;
			case 'Crédito':
				payment = 12;
				break;
			case 'PayPal':
				payment = 13;
				break;
			default:
				payment = 14;
				break;
		}

		orderDiv.childNodes.forEach((dish) => {
			orderItems.push({
				product_id: dish.getAttribute('data-id'),
				quantity: 1,
			});
		});

		let order = {
			payment_id: payment,
			status_id: 50,
			user_id: localStorage.getItem('id'),
			items: orderItems,
		};

		fetch('https://mechell-delilah.herokuapp.com/orders', {
			method: 'POST',
			body: JSON.stringify(order),
			headers: headers,
		}).then((res) => res.json());

		let nombre = localStorage.getItem('fullname').split(' ')[0];
		document.querySelector('.successfulOrder__p span').innerHTML = nombre;

		toggleClass(mainDivs[3], 'visually-hidden');
		toggleClass(mainDivs[4], 'visually-hidden');
	});

	//? SEGUIR PEDIDO
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

		document.querySelector('.dropdown').classList.add('done');
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
			localStorage.ordered = 'false';
		});
	});
})();
