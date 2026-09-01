//@ts-check
const express = require('express');
const prettier = require('prettier');

const PORT_NUMBER = 3000;

const app = express();
app.use(express.text({ type: '*/*', limit: '100mb' }));

app.post('/', async (request, response) => {
	const { filename } = request.query;
	if (typeof filename !== 'string')
		return response.status(400).send('Need query parameter: filename of type string');

	try {
		const formatted = await prettier.format(request.body, { filepath: filename });
		response.type('text/plain').send(formatted);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		response.status(400).send(message);
	}
});

app.listen(PORT_NUMBER, () => console.log('Prettier server listening on port ' + PORT_NUMBER));
