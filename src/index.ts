import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import swaggerUi from 'swagger-ui-express';
import {
	clientRouter,
	ingredientRouter,
	orderRouter,
	pizzaRouter,
} from './routes';
import swaggerDocument from './swagger.json';
import { loadFakeData, log } from './utils';
const app = express();
const port = 3000;

// Security

const options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt'),
};

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 heure
	max: 100, // 100 requête max
	message:
		'Trop de requête envoyée, veuillez réessayer plus tard (1 heure de délai)',
});

app.use(helmet());
app.use(limiter);

// Passport
/*
passport.use(
	new OAuth2Strategy(
		{
			authorizationURL: 'https://provider.com/oauth2/authorize',
			tokenURL: 'https://provider.com/oauth2/token',
			clientID: '123-456-789',
			clientSecret: 'secret',
			callbackURL: 'https://localhost/auth/provider/callback',
		},
		function (accessToken: any, refreshToken: any, profile: any, cb: any) {
			return cb(null, profile);
		}
	)
);

app.use(passport.initialize());

app.get('/auth/provider', passport.authenticate('oauth2'));

app.get(
	'/auth/provider.callback',
	passport.authenticate('oauth2', {
		failureRedirect: '/login',
	}),
	function (req, res) {
		res.redirect('/api-docs');
	}
);
*/

// Hello world for testing
app.get('/', (req, res) => {
	res.send('Hello world');
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Handlers
app.use(express.json());

// Logging
app.use((req, res, next) => {
	const send = res.send;
	log.info('Request params:', req.params);
	log.info('Request body:', req.body);

	res.send = (body) => {
		log.info('Response code:', res.statusCode);
		log.info('Response body:', body);
		res.send = send;
		return res.send(body);
	};

	next();
});

// Custom routers
app.use('/pizzas', pizzaRouter);

app.use('/orders', orderRouter);

app.use('/ingredients', ingredientRouter);

app.use('/clients', clientRouter);

// Listener
/*app.listen(port, () => {
	log.info(`HTTP server listening on port ${port}`);
});*/

loadFakeData();

https
	.createServer(options, app)
	.listen(port, () => log.info(`HTTPS server listening on port ${port}`));
