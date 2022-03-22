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

import { isTopic, isTopicInBloom } from '../../../src/validation/topic';
import {
	invalidTopicData,
	invalidTopicInBloomData,
	validTopicData,
	validTopicInBloomData,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('topic', () => {
		describe('isTopic', () => {
			describe('valid cases', () => {
				it.each(validTopicData)('%s', input => {
					expect(isTopic(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidTopicData)('%s', input => {
					expect(isTopic(input)).toBeFalsy();
				});
			});
		});

		describe('isTopicInBloom', () => {
			describe('valid cases', () => {
				it.each(validTopicInBloomData)('%s', (bloom, topic) => {
					expect(isTopicInBloom(bloom, topic)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidTopicInBloomData)('%s', (bloom, topic) => {
					expect(isTopicInBloom(bloom, topic)).toBeFalsy();
				});
			});
		});
	});
});
