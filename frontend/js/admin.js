const ordersContainer = document.getElementById('orders-container');
const spanDate = document.getElementById('span-date');
const popup = document.getElementById('popup');

var FETCH_URI = 'http://localhost:3000';
	// var FETCH_URI = 'https://mechell-delilah.herokuapp.com';

let now = new Date()
	.toLocaleDateString('es-AR', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	})
	.replace(',', ' ');
spanDate.innerHTML = now.charAt(0).toUpperCase() + now.slice(1);

let orders = [];

async function getOrders() {
	await fetch(`${FETCH_URI}/orders`, {
		headers: {
			authorization:
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMCwidXNlcm5hbWUiOiJhZG1pbiIsImlzX2FkbWluIjoxLCJpYXQiOjE1ODczNDU3MjJ9.YHk8MICr8Mv73sUyu1YLUkmKt4cXk-lWKmAgg85hnSE',
		},
	})
		.then((res) => res.json())
		.then((data) => (orders = data));
}

function printOrders(orders) {
	orders.forEach((order) => {
    let date = new Date(Date.parse(order.time)).toLocaleTimeString();
    let splitted = date.split(' ');
    splitted[0].split(':')
    splitted[0] = splitted[0].slice(0, -3);
    date = splitted.join('');
		ordersContainer.innerHTML += `
    <div class="row py-2">
			<div class="col">
				<a class="btnStatus">${order.status}&#9660;</a>
			</div>
			<div class="col"><span>${date}</span></div>
			<div class="col"><span>#${order.id}</span></div>
			<div class="col"><span>${order.items[0].description}</span></div>
			<div class="col">
				<i class="pr-2 fas fa-credit-card">${order.payment}</i><span>$660</span>
			</div>
			<div class="col"><span>${order.user}</span></div>
			<div class="col">
				<span>${order.address}</span>
			</div>
		</div>
  `;
	});
}

async function orderHandler() {
  await getOrders();
  await printOrders(orders);
  document.body.addEventListener('click', (e) => {
    if (e.target.className === 'btnStatus') {
      popup.classList.toggle('active');
    }
  })
}

orderHandler();