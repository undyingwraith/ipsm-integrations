import Parser from 'rss-parser'

export class FetchService {
    private parser: Parser<{ [p: string]: any }, { [p: string]: any }>;

    constructor() {
        this.parser = new Parser()
    }

    fetchFeed(sub: string): Promise<any[]> {
        return this.parser.parseURL(`https://www.reddit.com/r/${sub}/.rss`).then(r => r.items)
    }
}