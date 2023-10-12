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

// this file precalculate all the numbers limits
// Note: this could be simplified using ** operator inside a for loop, but babel does not handle it well
// 	you can find more at: https://github.com/babel/babel/issues/13109 and https://github.com/web3/web3.js/issues/6187

// Here is how the limits would be calculated with ** operator:
// const numberLimits = new Map<string, { min: bigint; max: bigint }>();
// for (let i = 8; i <= 256; i += 8) {
// 	numberLimits.set(`uint${i}`, {
// 		min: BigInt(0),
// 		max: BigInt(2) ** BigInt(i) - BigInt(1),
// 	});
// 	numberLimits.set(`int${i}`, {
// 		min: -(BigInt(2) ** BigInt(i - 1)),
// 		max: BigInt(2) ** BigInt(i - 1) - BigInt(1),
// 	});
// }

export const numberLimits: Map<string, { min: bigint; max: bigint }> = new Map([
	[
		'uint8',
		{
			min: BigInt('0'),
			max: BigInt('255'),
		},
	],
	[
		'int8',
		{
			min: BigInt('-128'),
			max: BigInt('127'),
		},
	],
	[
		'uint16',
		{
			min: BigInt('0'),
			max: BigInt('65535'),
		},
	],
	[
		'int16',
		{
			min: BigInt('-32768'),
			max: BigInt('32767'),
		},
	],
	[
		'uint24',
		{
			min: BigInt('0'),
			max: BigInt('16777215'),
		},
	],
	[
		'int24',
		{
			min: BigInt('-8388608'),
			max: BigInt('8388607'),
		},
	],
	[
		'uint32',
		{
			min: BigInt('0'),
			max: BigInt('4294967295'),
		},
	],
	[
		'int32',
		{
			min: BigInt('-2147483648'),
			max: BigInt('2147483647'),
		},
	],
	[
		'uint40',
		{
			min: BigInt('0'),
			max: BigInt('1099511627775'),
		},
	],
	[
		'int40',
		{
			min: BigInt('-549755813888'),
			max: BigInt('549755813887'),
		},
	],
	[
		'uint48',
		{
			min: BigInt('0'),
			max: BigInt('281474976710655'),
		},
	],
	[
		'int48',
		{
			min: BigInt('-140737488355328'),
			max: BigInt('140737488355327'),
		},
	],
	[
		'uint56',
		{
			min: BigInt('0'),
			max: BigInt('72057594037927935'),
		},
	],
	[
		'int56',
		{
			min: BigInt('-36028797018963968'),
			max: BigInt('36028797018963967'),
		},
	],
	[
		'uint64',
		{
			min: BigInt('0'),
			max: BigInt('18446744073709551615'),
		},
	],
	[
		'int64',
		{
			min: BigInt('-9223372036854775808'),
			max: BigInt('9223372036854775807'),
		},
	],
	[
		'uint72',
		{
			min: BigInt('0'),
			max: BigInt('4722366482869645213695'),
		},
	],
	[
		'int72',
		{
			min: BigInt('-2361183241434822606848'),
			max: BigInt('2361183241434822606847'),
		},
	],
	[
		'uint80',
		{
			min: BigInt('0'),
			max: BigInt('1208925819614629174706175'),
		},
	],
	[
		'int80',
		{
			min: BigInt('-604462909807314587353088'),
			max: BigInt('604462909807314587353087'),
		},
	],
	[
		'uint88',
		{
			min: BigInt('0'),
			max: BigInt('309485009821345068724781055'),
		},
	],
	[
		'int88',
		{
			min: BigInt('-154742504910672534362390528'),
			max: BigInt('154742504910672534362390527'),
		},
	],
	[
		'uint96',
		{
			min: BigInt('0'),
			max: BigInt('79228162514264337593543950335'),
		},
	],
	[
		'int96',
		{
			min: BigInt('-39614081257132168796771975168'),
			max: BigInt('39614081257132168796771975167'),
		},
	],
	[
		'uint104',
		{
			min: BigInt('0'),
			max: BigInt('20282409603651670423947251286015'),
		},
	],
	[
		'int104',
		{
			min: BigInt('-10141204801825835211973625643008'),
			max: BigInt('10141204801825835211973625643007'),
		},
	],
	[
		'uint112',
		{
			min: BigInt('0'),
			max: BigInt('5192296858534827628530496329220095'),
		},
	],
	[
		'int112',
		{
			min: BigInt('-2596148429267413814265248164610048'),
			max: BigInt('2596148429267413814265248164610047'),
		},
	],
	[
		'uint120',
		{
			min: BigInt('0'),
			max: BigInt('1329227995784915872903807060280344575'),
		},
	],
	[
		'int120',
		{
			min: BigInt('-664613997892457936451903530140172288'),
			max: BigInt('664613997892457936451903530140172287'),
		},
	],
	[
		'uint128',
		{
			min: BigInt('0'),
			max: BigInt('340282366920938463463374607431768211455'),
		},
	],
	[
		'int128',
		{
			min: BigInt('-170141183460469231731687303715884105728'),
			max: BigInt('170141183460469231731687303715884105727'),
		},
	],
	[
		'uint136',
		{
			min: BigInt('0'),
			max: BigInt('87112285931760246646623899502532662132735'),
		},
	],
	[
		'int136',
		{
			min: BigInt('-43556142965880123323311949751266331066368'),
			max: BigInt('43556142965880123323311949751266331066367'),
		},
	],
	[
		'uint144',
		{
			min: BigInt('0'),
			max: BigInt('22300745198530623141535718272648361505980415'),
		},
	],
	[
		'int144',
		{
			min: BigInt('-11150372599265311570767859136324180752990208'),
			max: BigInt('11150372599265311570767859136324180752990207'),
		},
	],
	[
		'uint152',
		{
			min: BigInt('0'),
			max: BigInt('5708990770823839524233143877797980545530986495'),
		},
	],
	[
		'int152',
		{
			min: BigInt('-2854495385411919762116571938898990272765493248'),
			max: BigInt('2854495385411919762116571938898990272765493247'),
		},
	],
	[
		'uint160',
		{
			min: BigInt('0'),
			max: BigInt('1461501637330902918203684832716283019655932542975'),
		},
	],
	[
		'int160',
		{
			min: BigInt('-730750818665451459101842416358141509827966271488'),
			max: BigInt('730750818665451459101842416358141509827966271487'),
		},
	],
	[
		'uint168',
		{
			min: BigInt('0'),
			max: BigInt('374144419156711147060143317175368453031918731001855'),
		},
	],
	[
		'int168',
		{
			min: BigInt('-187072209578355573530071658587684226515959365500928'),
			max: BigInt('187072209578355573530071658587684226515959365500927'),
		},
	],
	[
		'uint176',
		{
			min: BigInt('0'),
			max: BigInt('95780971304118053647396689196894323976171195136475135'),
		},
	],
	[
		'int176',
		{
			min: BigInt('-47890485652059026823698344598447161988085597568237568'),
			max: BigInt('47890485652059026823698344598447161988085597568237567'),
		},
	],
	[
		'uint184',
		{
			min: BigInt('0'),
			max: BigInt('24519928653854221733733552434404946937899825954937634815'),
		},
	],
	[
		'int184',
		{
			min: BigInt('-12259964326927110866866776217202473468949912977468817408'),
			max: BigInt('12259964326927110866866776217202473468949912977468817407'),
		},
	],
	[
		'uint192',
		{
			min: BigInt('0'),
			max: BigInt('6277101735386680763835789423207666416102355444464034512895'),
		},
	],
	[
		'int192',
		{
			min: BigInt('-3138550867693340381917894711603833208051177722232017256448'),
			max: BigInt('3138550867693340381917894711603833208051177722232017256447'),
		},
	],
	[
		'uint200',
		{
			min: BigInt('0'),
			max: BigInt('1606938044258990275541962092341162602522202993782792835301375'),
		},
	],
	[
		'int200',
		{
			min: BigInt('-803469022129495137770981046170581301261101496891396417650688'),
			max: BigInt('803469022129495137770981046170581301261101496891396417650687'),
		},
	],
	[
		'uint208',
		{
			min: BigInt('0'),
			max: BigInt('411376139330301510538742295639337626245683966408394965837152255'),
		},
	],
	[
		'int208',
		{
			min: BigInt('-205688069665150755269371147819668813122841983204197482918576128'),
			max: BigInt('205688069665150755269371147819668813122841983204197482918576127'),
		},
	],
	[
		'uint216',
		{
			min: BigInt('0'),
			max: BigInt('105312291668557186697918027683670432318895095400549111254310977535'),
		},
	],
	[
		'int216',
		{
			min: BigInt('-52656145834278593348959013841835216159447547700274555627155488768'),
			max: BigInt('52656145834278593348959013841835216159447547700274555627155488767'),
		},
	],
	[
		'uint224',
		{
			min: BigInt('0'),
			max: BigInt('26959946667150639794667015087019630673637144422540572481103610249215'),
		},
	],
	[
		'int224',
		{
			min: BigInt('-13479973333575319897333507543509815336818572211270286240551805124608'),
			max: BigInt('13479973333575319897333507543509815336818572211270286240551805124607'),
		},
	],
	[
		'uint232',
		{
			min: BigInt('0'),
			max: BigInt('6901746346790563787434755862277025452451108972170386555162524223799295'),
		},
	],
	[
		'int232',
		{
			min: BigInt('-3450873173395281893717377931138512726225554486085193277581262111899648'),
			max: BigInt('3450873173395281893717377931138512726225554486085193277581262111899647'),
		},
	],
	[
		'uint240',
		{
			min: BigInt('0'),
			max: BigInt(
				'1766847064778384329583297500742918515827483896875618958121606201292619775',
			),
		},
	],
	[
		'int240',
		{
			min: BigInt(
				'-883423532389192164791648750371459257913741948437809479060803100646309888',
			),
			max: BigInt('883423532389192164791648750371459257913741948437809479060803100646309887'),
		},
	],
	[
		'uint248',
		{
			min: BigInt('0'),
			max: BigInt(
				'452312848583266388373324160190187140051835877600158453279131187530910662655',
			),
		},
	],
	[
		'int248',
		{
			min: BigInt(
				'-226156424291633194186662080095093570025917938800079226639565593765455331328',
			),
			max: BigInt(
				'226156424291633194186662080095093570025917938800079226639565593765455331327',
			),
		},
	],
	[
		'uint256',
		{
			min: BigInt('0'),
			max: BigInt(
				'115792089237316195423570985008687907853269984665640564039457584007913129639935',
			),
		},
	],
	[
		'int256',
		{
			min: BigInt(
				'-57896044618658097711785492504343953926634992332820282019728792003956564819968',
			),
			max: BigInt(
				'57896044618658097711785492504343953926634992332820282019728792003956564819967',
			),
		},
	],
]);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
numberLimits.set(`int`, numberLimits.get('int256')!);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
numberLimits.set(`uint`, numberLimits.get('uint256')!);
