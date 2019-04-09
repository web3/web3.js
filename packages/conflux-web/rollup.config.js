import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig('ConfluxWeb', pkg.name, {
    'conflux-web-core': 'conflux-web-core',
    'conflux-web-core-helpers': 'conflux-web-core-helpers',
    'conflux-web-core-method': 'conflux-web-core-method',
    'conflux-web-utils': 'conflux-web-utils',
    'conflux-web-cfx': 'conflux-web-cfx',
    'conflux-web-net': 'conflux-web-net'
});
