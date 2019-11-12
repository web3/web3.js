const chokidar = require('chokidar');
const {exec} = require('child_process');

const watcher = chokidar.watch('./packages/**/src/**/*', {ignored: ['*/dist/*', 'node_modules'], followSymlinks: false});

watcher.on('change', (filename) => {
    exec('npm run build:dev', {cwd: './packages/' + filename.split('/')[1] + '/'}, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }

        if (stderr) {
            console.error(stderr.toString());
        }

        console.log(stdout.toString());
    });
});
