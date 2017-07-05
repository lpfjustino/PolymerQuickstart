var express = require('express'),
		_			 = require('lodash'),
		config	= require('./config'),
		jwt		 = require('jsonwebtoken');

var app = module.exports = express.Router();

var request = require('request');
var uuidv4 = require('uuid/v4');

var db_url = "http://127.0.0.1:5984/pet_loiro";

// XXX: This should be a database of users :).
var users = [
	{
		id: 1,
		username: 'admin',
		password: 'admin',
		role: 'admin'
	},
	{
		id: 2,
		username: 'user',
		password: 'user',
		role: 'user'
	}
	];

var products = [{}];

var services = [{}];

var pets = [{}];

var payments = [{}];

var carts = [{"id":1,"img_produto":"http://www.zolux.com/118394-large_default/soho-pet-carrier-black.jpg","nome_produto":"Bolsatransportadora","descricao":"Com essa bolsa, voce podera transportar seu cachorro de pequeno porte facilmente em viagens.","preco":160,"quantidade_no_carrinho":2,"total_item":320}];
var schedules = [{}];

function createIdToken(user) {
	return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

function createAccessToken() {
	return jwt.sign({
		iss: config.issuer,
		aud: config.audience,
		exp: Math.floor(Date.now() / 1000) + (60 * 60),
		scope: 'full_access',
		sub: "lalaland|gonto",
		jti: genJti(), // unique identifier for the token
		alg: 'HS256'
	}, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
	var jti = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < 16; i++) {
			jti += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	
	return jti;
}

function getUserScheme(req) {
	var id;
	var username;
	var type;
	var fullname;
	var address;
	var phone;
	var email;
	var pic;
	var role;
	var userSearch = {};

	// The POST contains a username and not an email
	if(req.body.username) {
	   username = req.body.username;
		type = 'username';
		userSearch = { username: username };
	}
	// The POST contains an email and not an username
	else if(req.body.email) {
		username = req.body.email;
		type = 'email';
		userSearch = { email: username };
	}

	id = req.body.id;
	password = req.body.password;
	fullname = req.body.fullname;
	address = req.body.address;
	phone = req.body.phone;
	email = req.body.email;
	pic = req.body.pic;
	role = req.body.role;

	return {
		id: id,
		username: username,
		password: password,
		type: type,
		fullname: fullname,
		address: address,
		phone: phone,
		email: email,
		pic: pic,
		role: role,
		userSearch: userSearch
	};
}

function getProductScheme(req) {
	var id;
	var nome;
	var descricao;
	var qtd;
	var imagem;
	var productSearch = {};

	id = req.body.id;
	nome = req.body.nome;
	descricao = req.body.descricao;
	qtd = req.body.qtd;
	imagem = req.body.imagem;
	productSearch = { id: id };

	return {
		id: id,
		nome: nome,
		descricao: descricao,
		qtd: qtd,
		imagem: imagem,
		productSearch: productSearch
	};
}

function getServiceScheme(req) {
	var id;
	var nome;
	var descricao;
	var preco;
	var imagem;
	var serviceSearch = {};

	id = req.body.id;
	nome = req.body.nome;
	descricao = req.body.descricao;
	qtd = req.body.qtd;
	imagem = req.body.imagem;
	serviceSearch = { id: id };

	return {
		id: id,
		nome: nome,
		descricao: descricao,
		qtd: qtd,
		imagem: imagem,
		serviceSearch: serviceSearch
	};
}

function getPetScheme(req) {
	var name;
	var breed;
	var age;
	var pic;

	name = req.body.name;
	breed = req.body.breed;
	age = req.body.age;
	pic = req.body.pic;

	return {
		name: name,
		breed: breed,
		age: age,
		pic: pic
	};

}

function getPaymentScheme(req) {
	var user;
	var items;
	var total;
	var type;


	user = req.body.user;
	items = req.body.items;
	total = req.body.total;
	type = req.body.type;

	return {
		user: user,
		items: items,
		total: total,
		type: type
	};
}

function getCartScheme(product) {
	var id;
	var img_produto;
	var nome_produto;
	var descricao;
	var preco;
	var quantidade_no_carrinho;
	var total_item;

	id = product.id;
	img_produto = product.img_produto;
	nome_produto = product.nome_produto;
	descricao = product.descricao;
	preco = product.preco;
	quantidade_no_carrinho = product.quantidade_no_carrinho;
	total_item = product.total_item;
	
	return {
		id : id,
		img_produto : img_produto,
		nome_produto : nome_produto,
		descricao : descricao,
		preco : preco,
		quantidade_no_carrinho : quantidade_no_carrinho,
		total_item : total_item
	};

}

function getScheduleScheme(req) {
	var servico;
	var data;
	var horario;

	servico = req.servico;
	data = req.data;
	horario = req.horario;
	
	return {
		servico : servico,
		data : data,
		horario : horario
	};

}

app.put('/register-user', function(req, res) {
	var userScheme = getUserScheme(req);

	if (!userScheme.username || !req.body.password) {
		return res.status(400).send("You must send the username and the password");
	}

	if (_.find(users, userScheme.userSearch)) {
	 return res.status(400).send("A user with that username already exists");
	}

	userScheme.id = _.max(users, 'id').id + 1;

	//users.push(userScheme);
	var id = uuidv4();
	var options = {
		method: 'PUT',
		url: 'http://localhost:5984/pet_loiro/'+id,
		headers: { 'content-type': 'application/json' },
		body: 
		{
			collection: 'users',
			userscheme: userScheme
		},
		json: true
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		console.log(body);
	});


	console.log('ai que penis');

	res.status(201).send({
		id_token: createIdToken(userScheme),
		access_token: createAccessToken(),
		role: req.body.role
	});
});

app.post('/register-product', function(req, res) {
	var productScheme = getProductScheme(req);

	// Ensures that no ID will be NaN
	if(_.max(products, 'id') != undefined)
		productScheme.id = _.max(products, 'id').id + 1;
	else
		productScheme.id = 0;


	products.push(productScheme);

	res.status(201).send({
		id_token: createIdToken(productScheme),
		access_token: createAccessToken(),
	});
});

app.post('/register-service', function(req, res) {
	var serviceScheme = getServiceScheme(req);

	// Ensures that no ID will be NaN
	if(_.max(services, 'id') != undefined)
		serviceScheme.id = _.max(services, 'id').id + 1;
	else
		serviceScheme.id = 0;

	services.push(serviceScheme);

	res.status(201).send({
		id_token: createIdToken(serviceScheme),
		access_token: createAccessToken(),
	});
});

app.post('/sessions/create', function(req, res) {
	var userScheme = getUserScheme(req);

	if (!userScheme.username || !req.body.password) {
		return res.status(400).send("You must send the username and the password");
	}

	var user = _.find(users, userScheme.userSearch);
	
	if (!user) {
		return res.status(401).send("The username or password don't match");
	}

	if (user.password !== req.body.password) {
		return res.status(401).send("The username or password don't match");
	}

	res.status(201).send({
		id_token: createIdToken(user),
		access_token: createAccessToken(),
		role: user.role
	});
});

app.post('/register-pet', function(req, res) {
	var petScheme = getPetScheme(req);

	// Ensures that no ID will be NaN
	if(_.max(pets, 'id') != undefined)
		petScheme.id = _.max(pets, 'id').id + 1;
	else
		petScheme.id = 0;

	pets.push(petScheme);

	res.status(201).send({
		id_token: createIdToken(petScheme),
		access_token: createAccessToken(),
	});
});

app.post('/register-payment', function(req, res) {
	var paymentScheme = getPaymentScheme(req);

	// Ensures that no ID will be NaN
	if(_.max(payments, 'id') != undefined)
		paymentScheme.id = _.max(payments, 'id').id + 1;
	else
		paymentScheme.id = 0;

	payments.push(paymentScheme);

	res.status(201).send({
		id_token: createIdToken(paymentScheme),
		access_token: createAccessToken(),
	});
});


app.post('/submit-cart', function(req, res) {
	var cart = [];
	req.body.forEach((product) => {
		var productScheme = getCartScheme(product);
		cart.push(productScheme);
	});
	console.log(cart);
	carts = cart;

	res.status(201).send({
		id_token: createIdToken(carts),
		access_token: createAccessToken(),
	});
});


app.post('/new-schedule', function(req, res) {
	var scheduleScheme = getScheduleScheme(req);

	// Ensures that no ID will be NaN
	if(_.max(schedules, 'id') != undefined)
		scheduleScheme.id = _.max(schedules, 'id').id + 1;
	else
		scheduleScheme.id = 0;

	schedules.push(scheduleScheme);

	res.status(201).send({
		id_token: createIdToken(scheduleScheme),
		access_token: createAccessToken(),
	});
});

app.get('/carts/:id', function(req, res) {
	var id = req.params.id;
	carts = _.filter(carts, (product) => {
		return product.id != id;
	});
	console.log(carts);

	res.status(201).send(carts);
});

app.get('/payments', function(req,res) {
	res.status(201).send(payments);
});

app.get('/carts', function(req,res) {
	res.status(201).send(_.sortBy(carts, 'type'));
});
