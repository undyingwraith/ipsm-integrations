import {IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {FetchService} from './service';
import {IpsmApp} from '@undyingwraith/ipsm-core';

export class IpsmRedditIntegration {
	private links: { [key: string]: string } = {};
	private fetchService: FetchService;
	private ipsm: IpsmApp;
	private ids: string[];

	constructor(private ipfs: IPFSHTTPClient, key: NodeRSA, ids: string[] = []) {
		this.ipsm = new IpsmApp(ipfs, key);
		this.fetchService = new FetchService();
		this.ids = ids;
	}

	registerLink(subreddit: string, ipsmBoard: string) {
		this.links[subreddit] = ipsmBoard;
	}

	update() {
		console.log('Updater started');
		for (let sub of Object.keys(this.links)) {
			void this.ipsm.announce(this.links[sub]);
			this.fetchService.fetchFeed(sub).then(async posts => {
				for (let post of posts) {
					if (this.ids.includes(post.id)) continue;

					await this.ipsm.postToBoard(this.links[sub], {
						content: [
							{
								mime: 'text/html',
								data: `<h1>${post.title}</h1>`,
							},
							{
								mime: 'text/html',
								data: post.content,
							},
						],
					});

					this.ids.push(post.id);
				}
			});
		}
		console.log('Updater finished!');
	}
}
