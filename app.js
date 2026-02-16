const express = require('express');
const { spawnSync } = require('child_process');
const path = require('path');

const PRETTIER_BIN = path.join(__dirname, 'node_modules', '.bin', 'prettier');

const app = express();
app.use(express.text({ type: '*/*' }));

app.post('/', (request, response) => {
	const { filename } = request.query;
	if (typeof filename !== 'string')
		return response.status(400).send('Need query parameter: filename of type string');

	const result = spawnSync(PRETTIER_BIN, ['--stdin-filepath', filename], {
		input: request.body,
		shell: true,
	});

	if (result.status !== 0)
		response.status(400).send(result.stderr.toString());
	else
		response.type('text/plain').send(result.stdout.toString());
});

app.listen(3000, () => console.log('Prettier server listening on port 3000'));
