#!/usr/bin/env node

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
const { Octokit } = require('@octokit/core');
const token = process.argv[2];
const commitSha = process.argv[3];
const prNumber = process.argv[4];

const owner = 'web3';
const repo = 'web3.js';

const octokit = new Octokit({
	auth: token,
});

const run = async () => {
	const list = await octokit.request(
		`GET /repos/${owner}/${repo}/commits/${commitSha}/comments`,
		{
			owner,
			repo,
			commit_sha: commitSha,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		},
	);
	// get latest commit comment body
	let body = list.data[list.data.length - 1].body;
	// remove <details> tag
	body = body.replace('<details>', '').replace('</details>', '');
	// find if there is already a comment in PR
	const comments = await octokit.request(
		`GET /repos/${owner}/${repo}/issues/${prNumber}/comments`,
		{
			owner,
			repo,
			issue_number: prNumber,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		},
	);
	const benchMarkComment = comments.data.find(c => c.body.includes(`# Benchmark`));
	if (benchMarkComment) {
		// update benchMarkComment
		await octokit.request(
			`PATCH /repos/${owner}/${repo}/issues/comments/${benchMarkComment.id}`,
			{
				owner,
				repo,
				comment_id: benchMarkComment.id,
				body,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28',
				},
			},
		);
	} else {
		// create new comment in PR
		await octokit.request(`POST /repos/${owner}/${repo}/issues/${prNumber}/comments`, {
			owner,
			repo,
			issue_number: prNumber,
			body,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});
	}
};

run().catch(console.error);
