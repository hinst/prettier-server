const express = require('express');
const { spawnSync } = require('child_process');
const path = require('path');

const PRETTIER_BIN = path.join(__dirname, 'node_modules', '.bin', 'prettier');

const app = express();
app.use(express.text({ type: '*/*' }));

app.post('/', (req, res) => {
	const { filename } = req.query;
	if (typeof filename !== 'string')
		return res.status(400).send('Need query parameter: filename of type string');

	const result = spawnSync(PRETTIER_BIN, ['--stdin-filepath', filename], {
		input: req.body,
		shell: true,
	});

	if (result.status !== 0)
		res.status(400).send(result.stderr.toString());
	else
		res.type('text/plain').send(result.stdout.toString());
});

app.listen(3000, () => console.log('Prettier server listening on port 3000'));
