const ordersContainer = document.getElementById('orders-container');
const spanDate = document.getElementById('span-date');
const popup = document.getElementById('popup');

// var FETCH_URI = 'http://localhost:3000';
var FETCH_URI = 'https://mechell-delilah.herokuapp.com';

let now = new Date()
	.toLocaleDateString('es-AR', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	})
	.replace(',', ' ');
spanDate.innerHTML = now.charAt(0).toUpperCase() + now.slice(1);

async function getOrders() {
	return await fetch(`${FETCH_URI}/orders`, {
		headers: {
			authorization:
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMCwidXNlcm5hbWUiOiJhZG1pbiIsImlzX2FkbWluIjoxLCJpYXQiOjE1ODczNDU3MjJ9.YHk8MICr8Mv73sUyu1YLUkmKt4cXk-lWKmAgg85hnSE',
		},
	}).then((res) => res.json());
}

function printOrders(orders) {
	orders.forEach((order) => {
		let date = new Date(Date.parse(order.time)).toLocaleTimeString();
		let splitted = date.split(' ');
		splitted[0].split(':');
		splitted[0] = splitted[0].slice(0, -3);
		date = splitted.join('');
		ordersContainer.innerHTML += `
    <div class="row py-2" data-id=${order.id}>
			<div class="col">
				<a class="btnStatus text-white font-weight-bold" style="background-color:${order.color}";>${order.status} <span id="btnTriangle">&#9660;</span></a>
			</div>
			<div class="col"><span>${date}</span></div>
			<div class="col"><span>#${order.id}</span></div>
			<div class="col-3"><span>${order.description}</span></div>
			<div class="col">
				<i class="pr-2 ${order.paymentIcon}"></i><span>$${order.total}</span>
			</div>
			<div class="col"><span>${order.user}</span></div>
			<div class="col">
				<span>${order.address}</span>
			</div>
		</div>
  `;
	});
}

function statusColor(orders) {
	orders.forEach((order) => {
		switch (order.status) {
			case 'confirmed':
				order.color = 'sandybrown';
				break;
			case 'new':
				order.color = 'indianred';
				break;
			case 'preparing':
				order.color = 'lemonchiffon';
				break;
			case 'delivering':
				order.color = 'mediumaquamarine';
				break;
			case 'delivered':
				order.color = 'gray';
				break;
			case 'cancelled':
				order.color = 'aliceblue';
		}
	});
}

function orderPayment(orders) {
  orders.forEach(order => {
    if (order.payment == 'debit' || order.payment == 'cash') order.paymentIcon = 'fas fa-wallet'
    else order.paymentIcon = 'fas fa-credit-card';
  })
}

function orderDescription(orders) {
	orders.forEach((order) => {
    order.description = '';
		order.items.forEach((item) => {
      let words = item.description.split(' ');
      item.description = '';
			words.forEach((word) => {
				if (word.length > 3) {
          word = word.substr(0, 3);
          word = word.charAt(0).toUpperCase() + word.slice(1);
          item.description += word;
        }
      });
      order.description += `${item.quantity}x${item.description} `;
		});
	});
}

function fillPopup(id) {
  let selectedOrder = orders.find(order => order.id == id);
  let child = document.createElement('div');
  child.className = 'popup--detail m-5';
  child.innerHTML = `
            <p>Detalle: <span>${selectedOrder.description}</span></p>
            <p>Total: <span>${selectedOrder.total}</span></p>
            <p>Estado: <span>${selectedOrder.status}</span></p>
            <p>Forma de pago: <span>${selectedOrder.payment}</span></p>
            <p>Dirección: <span>${selectedOrder.address}</span></p>
            <p>Usuario: <span>${selectedOrder.user}</span></p>
  `;
  popup.append(child);
}

async function orderHandler() {
	orders = await getOrders();
	statusColor(orders);
  orderDescription(orders);
  orderPayment(orders);
  await printOrders(orders);
	document.body.addEventListener('click', (e) => {
		if (e.target.classList.contains('btnStatus')) {
      let id = e.target.parentElement.parentElement.getAttribute('data-id');
      fillPopup(id);
			popup.classList.add('active');
		}
  });
  document.getElementById('btnClose').addEventListener('click', () => {
    popup.removeChild(popup.lastChild);
    popup.classList.remove('active');
  })
}

var orders;
orderHandler();
