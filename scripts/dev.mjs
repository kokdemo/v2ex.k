import { spawn } from 'node:child_process';

const child = spawn('npx', ['wxt'], {
  stdio: 'inherit',
  shell: true,
});

const openUrl = () => {
  const url = 'https://v2ex.com/';
  const command =
    process.platform === 'darwin'
      ? ['open', [url]]
      : process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '', url]]
        : ['xdg-open', [url]];

  const [bin, args] = command;
  const opener = spawn(bin, args, {
    stdio: 'ignore',
    detached: true,
  });

  opener.unref();
};

const timer = setTimeout(openUrl, 2500);

child.on('exit', (code) => {
  clearTimeout(timer);
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  clearTimeout(timer);
  console.error(error);
  process.exit(1);
});
