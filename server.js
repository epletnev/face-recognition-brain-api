const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

app.use(express.json());
app.use(cors());

const database = {
	users: [
	  {
	  	id: '123',
	  	name: 'John',
	  	email: 'john@gmail.com',
	  	password: 'cookies',
	  	entries: 0,
	  	joined: new Date()
	  },
	  {
	  	id: '124',
	  	name: 'Sally',
	  	email: 'sally@gmail.com',
	  	password: 'bananas',
	  	entries: 0,
	  	joined: new Date()
	  }
	]
}

app.get('/', (req, res)=> {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}	
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body; 
	db('users')
		.returning('*')
		.insert({		
		  	email: email,
		  	name: name,	  		  
		  	joined: new Date()
		})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
		}) 
		.catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	.where('published_date', '<', 2000)
    .update({
    status: 'archived',
    thisKeyIsSkipped: undefined
  })
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, ()=> {
	console.log('app is running on port 3000');
})
