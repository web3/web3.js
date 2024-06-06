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

import { Web3, Transaction } from 'web3';
import { TransactionMiddlewarePlugin } from '../../src/transaction_middleware_plugin';

const blockMockResult = {
    "jsonrpc": "2.0",
    "id": "a40a81fa-1f8b-4bb2-a0ad-eef9b6d4636f",
    "result": {
        "baseFeePerGas": "0x44dab2983",
        "blobGasUsed": "0x20000",
        "difficulty": "0x0",
        "excessBlobGas": "0x1c0000",
        "extraData": "0x407273796e636275696c646572",
        "gasLimit": "0x1c9c380",
        "gasUsed": "0xb7a086",
        "hash": "0xf2b1729965179032b17165678a1a212fa31cb008e30f4011ffe8ebdddbd02b95",
        "logsBloom": "0xc3a70590c1c62524173d1892e33888067101934dc0891c2c9a898252b6f320215084a48906452960820188d32bba6fb82ec989018a0268603a00a4c6432a11276c9a038c676938eb68bc436c9905a9a1b08d238fb4458f48498215808bec81112e2a3a54869ff22422a8e491093da8a40f601d198417041cd22f799f9048865006e0b069ab049b852442b310396248088145e2810f230f9a44000c6868bc73e9afa8832a8ac92fd609007ac53c0a9cba0645ce298080184624e8040831dbc331f5e618072407050250021b3210e542781183a612d4618c1244000d421a6ca9c01a57e86a085402c55ab413f840a001e7117894d0469e20c2304a9655e344f60d",
        "miner": "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
        "mixHash": "0x787ab1d511b72df60a705bb4cfc4e92e2f9d203e3e007ae3a0f757425951ca24",
        "nonce": "0x0000000000000000",
        "number": "0x131ad16",
        "parentBeaconBlockRoot": "0x03bbca9fd0c7a0a020de04287f489112c79bc268220e9ff8e18957cd0d5c3cad",
        "parentHash": "0xb1d8fa7b8346421d373a6d4c28575155516cea17c12a3df7201170c9e561b38c",
        "receiptsRoot": "0x4ec500bdcd761ad505b2a989156c9a9628058d415acc93d800487c7c76308c59",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "size": "0xcb90",
        "stateRoot": "0xafbb8743c0a5f4740e322217cb1f2780ee5c57c32bcd04e9256b09efc1a70568",
        "timestamp": "0x6661ab8b",
        "totalDifficulty": "0xc70d815d562d3cfa955",
        "transactions": [
            "0x589956b75d19dbaf9911f246c23d4b3327ef234872ec1931c419041b23eb5b41",
            "0x4d3793f20c25979bd329cafdd889ba6be015cfc999acce8642d6e757b5192e93",
            "0x5ba5618ca5a14bab50862255dc69726a498346f9832bd0fd1394e8834e56790b",
            "0x6df9678f350db7e30afc930b7246bf1c144b9acb7fd1d25d7e107d550ed5a061",
            "0xb8f48ff2876cc393725ea4162421754dfb74ff2364a12d4d3de2c6269f1958c7",
            "0x2e5cf7c0607025038b6ccd871dc9ce85af686fd5fa2c82e605198af9afa92cca",
            "0x307fb855836feff5d8d0969fa4a44d3c6ae31d335da6577f48f9496d6fe9e0b9",
            "0x1362bed1aa8a30d28b7b76c35c2a8601b257058beffa9490dcb20de12bcb15b2",
            "0x234c7cc346c204022b2e5ead6d2e8c02317aeb0ec5ca82bd97c2b5d5e59a280b",
            "0x45cc1b19997841512fafe455c620d26fc3e5c2be00f049c54b361d57bd543703",
            "0xba4bb578fab6c3b06c06f3c1b58b6a58c9e41f6f5966b33aa8c225ad6911102f",
            "0x10ccbaa56c6bba4370525d3a9e28527ae7eb8f66deff44a84607276d02e273e1",
            "0x2d5cb13120cc1da079af63c7ddb56847528f119b9db36776c4b8b9f11d41bcb3",
            "0xb19ca27383a7ec0b1d39db807549146b1963e5df9b248c5a32bbcbda05da1ff2",
            "0xade96205c52af215bdf44073e201d3e47d90c4e3a6912257c480f93bba89bdb3",
            "0x5cb9ad5c4c3cb8c329dd95fcdddf584895a168648423b2d51a8b54b1063dce3a",
            "0xb4bc1a7fb967ab3fac3de34509f4942a84b340f2a14bfb4f0d9e3cfb5b24d3d2",
            "0x075a59b9f5614542adeccb9e182364751d9f1541820849948e32295a8a26bb40",
            "0x96bf57f2a685e7cca5f9a390d263dceabd4760d35a8a3dc6a144969a78d738cf",
            "0xbdd3dcf10cf894912b4976654c6dfb0aa809693a58ca5332514fd0690090e066",
            "0xce353194805c241ee5cb44c3bf819ead88bf89626061215cf3ae884867ab89a4",
            "0x1733591265240bbf5bcaa93a893d738da5c341d3864993f0f924758eab4e062a",
            "0xec4befdff0e097fe50fac494a91bd0d0bda8a73ed94774413bc6c5ad02838291",
            "0xdbedd744f1f1bfa88fe4b8a599128fb93925769511e17ac3ed29e17f39ac117a",
            "0x607efb970bc3052703789aaf6d98752b72bc5b11217556f2593e9ba96aab09e8",
            "0x9fff0f33c634ae8ab79890f287f656f0eb62378060fd36ec7753b5d23ca441c9",
            "0x1161d91add388289756da2c322520209219a4a54a9ce9c614167c51b710908ce",
            "0x52473921af74e51eb1db489586ac477906d7cc60cbd9182490e9b235ed7549e7",
            "0xca3dacb68437a2c48295237efce6ce0bf7eedf7a15055e8956636e74c5a9a16b",
            "0xe1f1667b52d365a371a8a9f2c4f3de2b9a99c949419c5643839aa5436dde96b7",
            "0x7b47a0e1a6aee9174f629309090c98c7ed05301ee3361573fed1f4c1f11c97f1",
            "0x9595271193a1e62e4e8ed6cef9e968b20df330b61b0dd57fdff056eda1809992",
            "0xfd446a3e6c48637f1d56b09bb41d42c2f938c20b1026b9e303e3a3043bbe79ba",
            "0xa48bd464dd246df5fe8b74834bfbed13a3565f940c9a2bd39832a67f30b0efb9",
            "0x7f299eb594a95f8ccf57ec60baa529bab269d54a839a1c671add5e9a9a553c2a",
            "0x335bca4fa906dc240e3358021bce920373ad9f70c002ce07d0fc442e988b1e26",
            "0x447d21c86f722e388a0939a4be76348f0a8ba93fb8d26947abda595442eb22ff",
            "0x2bbb58ed09c6bd795056ba948cf4af8bb483f7c9af101ec8b8344043a5d4adaa",
            "0xaa066c173fb6b201e83ca97398f272533c48b24611a0ec8c1ac5fa302c81263d",
            "0xa268efcdaf8e609dcbc6109fe10ca055d47fc545ea27e7b20de71c34c150fb2a",
            "0x1bef83b572de1f3c09fdbb152dbfddf89143b4d495b466364d3b15c3f2d24b48",
            "0x43bb3be09cd7959b763d34345e91d47219196ba1b438ebd0eac07cef68c2697e",
            "0xe04cec51c0dd42b21dabec402c34dc6bc089ec6b23f844e136e5d3f4d230a8c8",
            "0x298eb1538443b234d89de87dedf3beb663f00a50040d7127e0bd82dbae672ef7",
            "0xd5be09a856c70251f577134c976e37ced1c975d31cc249da4395ebe3cd9f8e6d",
            "0x60f3e03084350004a74b351b9256a82f76b900d8425cfb0cf3f6f65f0e159cde",
            "0x0cb655f6e6109c55117535fd28f7de7b9ba9fc281138c2edd73252122e2faed8",
            "0x602fda999b342bc93f49d935ab09f7e872cf2fc2e3d3cbe14607f4ee84564ca3",
            "0x05d3d38e78fe410a29814027dc98c997acfd126bbc814e53155fe42cf099cc3e",
            "0xc4df87c2122ac4c4e18aa2ba29e09ef0a2ae2ff1d929bef335859e5e55a967d1",
            "0xee48963abc9a32939b8fd04ee175770235402d191230ad06659e91c217a01f9b",
            "0xb6a534cdb32a693524bedc356f3bb7e8db4a47acb6d026f4a38145deea12bb70",
            "0xa52645d3630cd0ec7878dfa0c327920a4e6dbd3af8d08e62a9b9d02037531c42",
            "0x0cabdb210ec64a48aa8391bf391ffa53af6e18e7277477ee0ac34744c2dd8e78",
            "0x604eb09b8ee24654d6f445f4d1bd1bd883308d80c7bc4b63d91ed0d31469a257",
            "0x1c8771460831c881b97a65d9f17af2b38fb5782cf420a77502b9ce78eb37f55b",
            "0xb7b12080593ed719c104f9de07c5cba67a18dfba51c4f285ef49ceff0fd229b2",
            "0x7bed063819e06738494fc2862af3f83623022cdabe58fb10da9acce1e5e95173",
            "0xc69a26df6b0b03ce401711326469c1078f74278f938a0b79ffced589e5e72e62",
            "0x4ceeea12a99d588e5f7bcb1b295497c69e4132b6e70a9e2d6893d56177ff8dea",
            "0xc9166820e8974228dd639f331a5d7902eaf5b7e383f1de9d7ed8b61d98afa849",
            "0x69301208a0996629bb62548e598d86cdcb3766eb823e2ab975103eaad6549a6c",
            "0xa3bfa2fe14cce12697201e1c4b042e9c4d795d928eeb250bfd894ec674076a1b",
            "0xb54615c3f0d2b604e79dcf1ba10919eede9e7a9d22d29b464e24d72a9b189a70",
            "0xe72cee09864fa7d9a7f4341bb07d71e2e9a0f6a1126e4a28a8f87a483041938e",
            "0x8d04cab2d9c00cd44097461ddfc73f2aeb2c4b0ee9e3b30b3b66602b1fc951f9",
            "0x58e6bff89a1c06e2a432213ed5f91bdd0267e0f4c6e0fd0a74b7990caac755b9",
            "0x37153d4bd0f198dd2551299ec35ee4f59516d2163442558ccb9b68ef722610ab",
            "0xf6a416beeee0b506036672a65b56f7f07d5847508873dcae1ac4958a85c6682f",
            "0x221d3b854dd85a4fa91dfe8a7f768b7604c9b9ecab9e7c83ae38b6793506e7c1",
            "0x9d3fc29d08d83619076bca022e67ce9353a5dc7bc87b8eb25dd951398ded1e3c",
            "0x733d787015999deb7a5b344530582ea2ff9f46616d9be0fdae1127de9f85851d",
            "0xd192f5daa695c805d177ac2151eeb1d269b162335d6e5ba25f9ef0ccd62ccfbf",
            "0x18495bd3f9abe63818c07eeb0d49d35acc14b3c9ba04d20b86d957d9a45f8a52",
            "0x17a1701fd5394573da88c432e790fa95015a0588ea43463b4141abc5c47a7468",
            "0x7cf96848bbc289791039098df1494de70fd4ddc93145317052366f9a4b94f286",
            "0xe0df42b941e4a6d8138d9994a1117d87f703e56df50a11ca2c8a06228ece1c84",
            "0xe47e77721097f39ba8c402b8c2081f0df85ab23e7cabfd39c53b69975029ff31",
            "0x2e0fac0a7d9db97a334bc6ed766c456dbf0e50e15f7b4fdfcbaa638b3900cf5f",
            "0xb19eff5deb2af8a69235a646d9079cf67ab54db9e0d6c1b7117d3b3194c34e42",
            "0x27345b4554c6f12d482ac8312448f32aca09c05e7517401b83b36420edb44b8e",
            "0xcb05b5d1eaa5e42ade432aa1b02282896c3bb29021c43bd000fabbe51ef77439",
            "0x052ab6c5599847b5c45276b26e2f0db74035bdc86d373758c1501a4744c3d7d0",
            "0x4f657afc26ae75f5046a30c313cab06211c71e235f23a5b72b3ec992fcac850b",
            "0xb8a55dc3d4be733ce3ba73629ea4bb5700b2a5ffef55b749427dd6b4e920b967",
            "0x96937fefedb9c117402f86e67619022a98c145fb681554ae34741179edd8d8c5",
            "0x25b65e28e22f7189c72972f754a14816490a6997dc19f8865c28ca5b6ec3b626",
            "0xfdb650da2052ec06dd040f971e48b5476088c9919237c8180e219876d2832c08",
            "0x169a642bd47c59bec96b0441737b21a393a0670640ba3a9d31196f4df1ef8b51",
            "0x6453f4633801db0bd38145924b8744864154c49b2ac0aa0a8ba23c6214019658",
            "0x29c7d4834c0c6040b0bb818c649dcc5dfb128661ec153f998cf11895b6eff867",
            "0xdfa1be187788f459f518fadd2c6dee5c62d4d8c68bef801c1936127631c74368",
            "0x9d0dd1c11f4e6091d6e6e6de30ca1e7fdf463fb111884e4d4402e5fa90d728ac",
            "0xb1b160f7ba46ea1695811b8f4b8738b6621bd516c4455d9384d8e57fbed06cf3",
            "0x9901b0f95df2acb8fd54486971572a034c296f9e2620fedc9fdfac1ee3099260",
            "0xb587172cb3d7256037ba775b37bb8f00ef6c4589afada5fe5f638ad9fbde3261",
            "0x63007117e6a9a7562d6914d52b5868a4315a4e4e457aec6735cb5e32a0efa0f0",
            "0x4de019d4e050f735b625b9475730d32e299393b6f41fd3c7642acbbdbf9e13dc",
            "0x8b5f1c98db2d3fa96d10da3f91b1fc9bacde9bcdd1eb0bfdb3b3e3a891c51b46",
            "0xb30f97e59f5474a6c6ba9ba205dd20980bd3637cc2aff70be1ae67e6d9db340b",
            "0xe439f9d17f6e47578713ecf1e97a8e176c3b92a54198aeff23791d2edbae2d4d",
            "0x51be0a231052db17e26d5e193b69efb645e04a375943c893f446c630a8daf2a0",
            "0x357b20acabe05a415d2ae16eba23586a623cec105874340ce2929b6e58d9424d",
            "0xaac87dbf111cb9ed2ce3c41056d114684a0c02fd013151e2904de67cd5a45337",
            "0x1fe34da05cd4edf2eac1b5f195d361a3d155ff83bee22684e81c4d8aecf2182f",
            "0xdca2ac812c4ec107c2115e4f720e1e7271add3caed13b053ae5ee474e4764b23",
            "0x32554f6370c0dd48e2f382f17e49912c9e32be0fd58024c3c11755959d83f3b8",
            "0x66b19a7488c2cae34dd21c7d2f6240a9bc227c3093273bb948e10a889f584f2c",
            "0xe8ab6613e12c5c1e40d6db80ef2cd7de48f3e6cd33c317adef747604c4d7a10c",
            "0x5bce8a1a776f2894b7616fad93ebecb45b34185458e950c533cb2119d123ef09",
            "0xe510e4cd8345720c5787f22f1a1c2fbe6f387b94284cdd3ef78cd66b64b6bc9f",
            "0x7b12a29841f647578bb66b8a1178182add8dab0820eb431b22680c230e3b061e",
            "0x05646a62cece839eef22c3a0cb9692935bf7a56a38502c225488fb137ecf513e",
            "0xfc2cd0625f6b24f20d93b6799bee7bedb39e492b0e39ad32ae9b009d20a5af93",
            "0xfd99705b3e9eeb8466929ee91f23d4c532b7bfdb6d81b225311ec2068b9f1c36",
            "0xbce141f2366cd9cd04ade75ce41a7fcc1a15bcc397d354853be353d872f916d3",
            "0x5d8a70359145514cd7faafdc7e7f3089253cc46d26cabfb8fb3079132c6dddee",
            "0xebed62d967e265a79c8b181867250aca3811e24fac49ca5e116bc9cac713d9e5",
            "0x6b95433ba1657bbc6e6bc4cd9ac303689677eb7bbd0f28c3e37cd04e4f1d9ff7",
            "0x73d93b0b6c09ecee94855f505f2ef8e589a37c83bb38c132dc5ab69159953d37",
            "0xf34d36e25cfe53b042a0f9677cb2982974b4c734bfcfebfb8afa7547ae3b38f5",
            "0x85f7798b5bc7c9c4540e5a44e8777bfb2fbbc6d95d2ab04f5248c952bb1db6c3",
            "0xb78858556cb8ff769f3eb90256fe6bb579a9e578a0f99e052a626bf554f519a5",
            "0xa9aebdd494d3b81e40852dd29af28b9b655d9df3855b813b4764eb3418205ba5",
            "0x455322b796cf38795983514219b5a35c4a5ae55f3e3208f37b0abe70000c522c",
            "0x87c3eca6735b59cb499a34109330577cfd5c108f391596be4cffcaa869c87706",
            "0xe5048ecc49abd216c6f2fa3341f483557313929f95a84cdc2ae7ffc30a770d47",
            "0x16c4d34f2eef545f48682ce4e6d21a00ecc1e5e90fea1a1960d55f1c98e0dafc",
            "0x8c80ffbf6e3351384210259e4a5d3ae7a7fc15abd5612450a4f1c5aab78372f4",
            "0x563749a0278316b5d1c8d9af28e8a431368ad33280183ae2b789de7d77541573",
            "0x1dc3ac0102d0820ff0fc019b226a4745ed22649160cc49cfabc6c6fbf6962ee9",
            "0xa9b37d52f97797b2ed77d420602ac7e29b30d29995f0b64004935c9bc20812c4",
            "0x4e83e5798b7627a1e7cab2289c2947d9e1e52a30c07d710de822495c208a115e",
            "0x928e7f14a3271e3d7fbffc64be2ce3e4efeaeb26753e9df1dfa54327c919788f",
            "0x292e9d78d823e2b1868623e1b875120195a091d4216bc04223e4d56cc7aae489",
            "0x557531c70c4d724c215e45e0e05163330e50f3b210c49af7ae303e91f2e9f4e8",
            "0x2a9b3641eaa4c8b7c0533d25c1105512974ee237736c95827c31c26bf1eb4376",
            "0x8238a7412374b1ce63708808d1830194e8ec1227374f626ba6a360d2db808057",
            "0x916a29973222149afb7d1391502f42f09a2715c3a723434ac13a35e35d138ed6",
            "0xd08f9f93567e730d918b7869057bc87797f1c86536cba6702c21711e1612adde",
            "0x61e8a4ef51ee32cc7aceb8d5c0d639fa872e1081f45e66322de24467c487d240",
            "0x41c3867ca86d1050ecd1abd079038426780122c8061550c125cd0a3ebb8952de",
            "0x31e03664a6408703d22fbc569fb340d62013d9b665e6645487fafac4f2ebed9b",
            "0x28b8fb9f0627c13153f823447f1d88b1793cd65129834e79d912c80c263a3b7a",
            "0xc682c001255da84aad2f299de6acf1e3bc274c45e053b4df532068e6fb726ac1",
            "0x61d5876752988987d801c8aa5b15915120b65c6071ba69b9cc8fd855006913ee",
            "0xbd32ae10b4199aefc6b55466a85d24e9798b826a55c2623ddc9ef3da35e945b4",
            "0x246d8f766ea302d7d3489e3cf0a7983f1df37cd00e8a8aa36ed33b765b2071df",
            "0xbc550245642b960b2f112e2384fa8e03742a6eaaf8f1d909efb2f71a64f0a4ee",
            "0x732ff4b0d1a97e55a5e201e3bff261b88e9027a505a66ac48dae5fd3eb445c25",
            "0xb7a6b4d107b8e2e234601c89d144a649d5116dbc8a9f1b4b70be685f35125312",
            "0x02e78f57263809a4758e6abd0ca6f6cdf664e35102ed5cb1c9c45f8c6dbabaec"
        ],
        "transactionsRoot": "0xc21a4d667b5f841538430b1e2c002c598f2178628ad1d61ea2fda462d1216607",
        "uncles": [],
        "withdrawals": [
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11b526f",
                "index": "0x2dbe44b",
                "validatorIndex": "0x10f63c"
            },
            {
                "address": "0xdc2b79e92369c4e60a8eaec19e53c826a515c9bb",
                "amount": "0x119b4dc",
                "index": "0x2dbe44c",
                "validatorIndex": "0x10f63d"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11ac96a",
                "index": "0x2dbe44d",
                "validatorIndex": "0x10f63f"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11bc1b7",
                "index": "0x2dbe44e",
                "validatorIndex": "0x10f640"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11be270",
                "index": "0x2dbe44f",
                "validatorIndex": "0x10f641"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11bd9e6",
                "index": "0x2dbe450",
                "validatorIndex": "0x10f642"
            },
            {
                "address": "0x434a603f8eee540f271b16479c0618f4737d0f90",
                "amount": "0x118ea2e",
                "index": "0x2dbe451",
                "validatorIndex": "0x10f643"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11c37f8",
                "index": "0x2dbe452",
                "validatorIndex": "0x10f644"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11babeb",
                "index": "0x2dbe453",
                "validatorIndex": "0x10f645"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11b6d8c",
                "index": "0x2dbe454",
                "validatorIndex": "0x10f646"
            },
            {
                "address": "0xb3e84b6c6409826dc45432b655d8c9489a14a0d7",
                "amount": "0x11b4ce2",
                "index": "0x2dbe455",
                "validatorIndex": "0x10f647"
            },
            {
                "address": "0x7e2a2fa2a064f693f0a55c5639476d913ff12d05",
                "amount": "0x11ad733",
                "index": "0x2dbe456",
                "validatorIndex": "0x10f648"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11b91ab",
                "index": "0x2dbe457",
                "validatorIndex": "0x10f649"
            },
            {
                "address": "0x7e2a2fa2a064f693f0a55c5639476d913ff12d05",
                "amount": "0x11a770e",
                "index": "0x2dbe458",
                "validatorIndex": "0x10f64a"
            },
            {
                "address": "0x7e2a2fa2a064f693f0a55c5639476d913ff12d05",
                "amount": "0x11a492a",
                "index": "0x2dbe459",
                "validatorIndex": "0x10f64b"
            },
            {
                "address": "0xea97dc2523c0479484076660f150833e264c41e9",
                "amount": "0x11b705f",
                "index": "0x2dbe45a",
                "validatorIndex": "0x10f64c"
            }
        ],
        "withdrawalsRoot": "0x2914fa2f5ed93880ed45b58e8f6d14f20c645988400d83c59109964e2053fe1a"
    }
};

const receiptMockResult = {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "blockHash": "0xf4ad699b98241caf3930779b7d919a77f1727e67cef6ed1ce2a4c655ba812d54",
        "blockNumber": "0x131ad35",
        "contractAddress": null,
        "cumulativeGasUsed": "0x8cae7a",
        "effectiveGasPrice": "0x4c9bc2d65",
        "from": "0xab6fd3a7c6ce9db945889cd018e028e055f3bc2e",
        "gasUsed": "0xa145",
        "logs": [
            {
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "blockHash": "0xf4ad699b98241caf3930779b7d919a77f1727e67cef6ed1ce2a4c655ba812d54",
                "blockNumber": "0x131ad35",
                "data": "0x000000000000000000000000000000000000000000000000000000000016e360",
                "logIndex": "0xdf",
                "removed": false,
                "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x000000000000000000000000ab6fd3a7c6ce9db945889cd018e028e055f3bc2e",
                    "0x00000000000000000000000051112f9f08a2174fe3fc96aad8f07e82d1cccd00"
                ],
                "transactionHash": "0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f",
                "transactionIndex": "0x82"
            }
        ],
        "logsBloom": "0x00000000000000000000000002000000000000000000000000000000004000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000400000000000100000000000000000000000000080000000000000000000040000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000400000000000000000000000",
        "status": "0x1",
        "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "transactionHash": "0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f",
        "transactionIndex": "0x82",
        "type": "0x2"
    }
};

describe('Transaction Middleware', () => {

	it('should modify transaction before signing', async () => {
		const web3 = new Web3('http://127.0.0.1:8545');
		const plugin = new TransactionMiddlewarePlugin();

		/// Mock block starts - Mock web3 internal calls for test
		let blockNum = 1000;

		web3.requestManager.send = jest.fn((request) => {
			blockNum++;

			if(request.method === 'eth_getBlockByNumber'){

				return Promise.resolve(blockMockResult.result);
			}
			else if(request.method === 'eth_call'){

				return Promise.resolve("0x");
			}
			else if(request.method === 'eth_blockNumber'){

				return Promise.resolve(blockNum.toString(16));
			}
			else if(request.method === 'eth_sendTransaction'){

                //Test that middleware modified transaction
				expect((request.params as any)[0].data).toStrictEqual("0x123");

				return Promise.resolve("0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f");
			}
			else if (request.method === 'eth_getTransactionReceipt') {
				return Promise.resolve(receiptMockResult.result);
			}
			
			return Promise.resolve("Unknown Request" as any);
		});

		/// Mock block ends here

		web3.registerPlugin(plugin);

		const transaction: Transaction = {
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
			value: '0x1',
			data: '0x1'
		};
		
        await web3.eth.sendTransaction(transaction as any);

	});
});
