/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
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

export const hardforks: { [key: string]: any } = {
	chainstart,
	homestead,
	dao,
	tangerineWhistle,
	spuriousDragon,
	byzantium,
	constantinople,
	petersburg,
	istanbul,
	muirGlacier,
	berlin,
	london,
	shanghai,
	arrowGlacier,
	grayGlacier,
	mergeForkIdTransition,
	merge,
};
