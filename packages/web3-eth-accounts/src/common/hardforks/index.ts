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
import chainstart from './chainstart';
import dao from './dao';
import homestead from './homestead';
import tangerineWhistle from './tangerineWhistle';
import spuriousDragon from './spuriousDragon';
import byzantium from './byzantium';
import constantinople from './constantinople';
import petersburg from './petersburg';
import istanbul from './istanbul';
import muirGlacier from './muirGlacier';
import berlin from './berlin';
import london from './london';
import shanghai from './shanghai';
import arrowGlacier from './arrowGlacier';
import grayGlacier from './grayGlacier';
import mergeForkIdTransition from './mergeForkIdTransition';
import merge from './merge';

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
