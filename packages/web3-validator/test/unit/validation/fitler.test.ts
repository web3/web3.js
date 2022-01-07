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
