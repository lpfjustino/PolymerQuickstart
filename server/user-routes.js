var express = require('express'),
		_			 = require('lodash'),
		config	= require('./config'),
		jwt		 = require('jsonwebtoken');

var app = module.exports = express.Router();

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
	let jti = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 16; i++) {
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
    }
}

function getProductScheme(req) {
	var id;
	var nome;
	var descricao;
	var qtd;
	var imagem;
	var productSearch = {}

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
    }
}

function getServiceScheme(req) {
	var id;
	var nome;
	var descricao;
	var preco;
	var imagem;
	var serviceSearch = {}

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
    }
}

app.post('/users', function(req, res) {
    var userScheme = getUserScheme(req);

	if (!userScheme.username || !req.body.password) {
		return res.status(400).send("You must send the username and the password");
	}

	if (_.find(users, userScheme.userSearch)) {
	 return res.status(400).send("A user with that username already exists");
	}

	userScheme.id = _.max(users, 'id').id + 1;
	console.log(users)
	users.push(userScheme);
	console.log(users)

	res.status(201).send({
		id_token: createIdToken(userScheme),
		access_token: createAccessToken(),
        role: req.body.role
	});
});

app.post('/register-product', function(req, res) {
    var productScheme = getProductScheme(req);

	if (_.find(products, productScheme.productSearch)) {
	 return res.status(400).send("A product with that id already exists");
	}

	productScheme.id = _.max(products, 'id').id + 1;

	products.push(productScheme);

	res.status(201).send({
		id_token: createIdToken(productScheme),
		access_token: createAccessToken(),
	});
});

app.post('/register-service', function(req, res) {
    var serviceScheme = getServiceScheme(req);

	if (_.find(services, serviceScheme.serviceSearch)) {
	 return res.status(400).send("A service with that id already exists");
	}

	serviceScheme.id = _.max(services, 'id').id + 1;

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

