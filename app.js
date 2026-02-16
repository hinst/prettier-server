const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const PRETTIER_BIN = path.join(__dirname, 'node_modules', '.bin', 'prettier');

const app = express();
app.use(express.text({ type: '*/*' }));

app.post('/', (req, res) => {
	const { filename } = req.query;
	if (typeof filename !== 'string')
		return res.status(400).send('Need query parameter: filename of type string');

	const prettier = spawn(PRETTIER_BIN, ['--stdin-filepath', filename], {
		shell: true,
	});

	const out = [];
	const err = [];

	prettier.stdout.on('data', (d) => out.push(d));
	prettier.stderr.on('data', (d) => err.push(d));

	prettier.on('close', (code) => {
		if (code !== 0) {
			res.status(400).send(Buffer.concat(err).toString());
		} else {
			res.type('text/plain').send(Buffer.concat(out).toString());
		}
	});

	prettier.stdin.write(req.body);
	prettier.stdin.end();
});

app.listen(3000, () => console.log('Prettier server listening on port 3000'));
