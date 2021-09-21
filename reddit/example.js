const {IpsmRedditIntegration} = require('./dist/index.js')
const {create} = require("ipfs-http-client");
const NodeRSA = require("node-rsa");
const fs = require('fs')

const ID_FILE = './identity.pem'

const ipfs = create()
const id = new NodeRSA()

if (!fs.existsSync(ID_FILE)) {
    id.generateKeyPair()
    const data = id.exportKey('private')
    fs.writeFileSync(ID_FILE, data)
} else {
    const data = fs.readFileSync(ID_FILE)
    id.importKey(data, 'private')
}

const integration = new IpsmRedditIntegration(ipfs, id)

integration.registerLink('ipfs', 'r/ipfs')
integration.registerLink('IPFS_Hashes', 'r/IPFS_Hashes')
integration.update()
