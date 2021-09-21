import {IPFSHTTPClient} from "ipfs-http-client";
import NodeRSA from 'node-rsa';
import {FetchService} from "./service";
import {IpsmApp} from '@undyingwraith/ipsm-core';

export class IpsmRedditIntegration {
    private links: { [key: string]: string } = {};
    private fetchService: FetchService;
    private ipsm: IpsmApp;

    constructor(private ipfs: IPFSHTTPClient, key: NodeRSA) {
        this.ipsm = new IpsmApp(ipfs, key)
        this.fetchService = new FetchService()
    }

    registerLink(subreddit: string, ipsmBoard: string) {
        this.links[subreddit] = ipsmBoard
    }

    update() {
        for (let sub of Object.keys(this.links)) {
            this.fetchService.fetchFeed(sub).then(async posts => {
                for (let post of posts) {
                    //TODO: check if post already exists
                    await this.ipsm.postToBoard(this.links[sub], {
                        content: [
                            {
                                mime: 'text/html',
                                data: `<h1>${post.title}</h1>`
                            },
                            {
                                mime: 'text/html',
                                data: post.content
                            }
                        ]
                    })
                }
            })
        }
    }
}
