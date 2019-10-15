/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import BN = require('bn.js');
import {isHexStrict} from 'conflux-web-utils';

// $ExpectType boolean
isHexStrict('0xc1912');
// $ExpectType boolean
isHexStrict(345);

// $ExpectError
isHexStrict(new BN(3));
// $ExpectError
isHexStrict({});
// $ExpectError
isHexStrict(true);
// $ExpectError
isHexStrict(['string']);
// $ExpectError
isHexStrict([4]);
// $ExpectError
isHexStrict(null);
// $ExpectError
isHexStrict(undefined);
