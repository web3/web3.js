import chainstart from './chainstart.json';
import dao from './dao.json';
import homestead from './homestead.json';
import tangerineWhistle from './tangerineWhistle.json';
import spuriousDragon from './spuriousDragon.json';
import byzantium from './byzantium.json';
import constantinople from './constantinople.json';
import petersburg from './petersburg.json';
import istanbul from './istanbul.json';
import muirGlacier from './muirGlacier.json';
import berlin from './berlin.json';
import london from './london.json';
import shanghai from './shanghai.json';
import arrowGlacier from './arrowGlacier.json';
import grayGlacier from './grayGlacier.json';
import mergeForkIdTransition from './mergeForkIdTransition.json';
import merge from './merge.json';

export const hardforks: [[string, typeof chainstart]] = [
	['chainstart', chainstart],
	['homestead', homestead],
	['dao', dao],
	['tangerineWhistle', tangerineWhistle],
	['spuriousDragon', spuriousDragon],
	['byzantium', byzantium],
	['constantinople', constantinople],
	['petersburg', petersburg],
	['istanbul', istanbul],
	['muirGlacier', muirGlacier],
	['berlin', berlin],
	['london', london],
	['shanghai', shanghai],
	['arrowGlacier', arrowGlacier],
	['grayGlacier', grayGlacier],
	['mergeForkIdTransition', mergeForkIdTransition],
	['merge', merge],
] as unknown as [[string, typeof chainstart]];
