import { sha256 } from '@noble/hashes/sha2';
import {setTimeout} from 'timers/promises';


let res=[];
const init_round=12653804;


async function get_key(round: num=0){
 const reqresult = await 
fetch("https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971/public/"+(round==0?'latest':round.toString()), {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
  },
    "method": "GET"
});

const data = await reqresult.json();
console.log(data);
return data.signature;
}


function hex16String2Vector(str: string) {
  let byteArray = [];
  for (let i = 0; i < str.length; i += 2) {
    byteArray.push(parseInt(str.slice(i, i + 2), 16));
  }

  return byteArray;
}
function randomness_str(str: string) {


  return sha(hex16String2Vector(str));
}

function randomness (unit8a) {
  return sha256(new Uint8Array(unit8a));
}



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function safe_selection(arg0: BigInt, unit8a) {
       
        let v0 = 0n;
        let v1 = 0;
        while (v1 < 16) {
            let v2 = (v0*256n)% BigInt(arg0);
            v0 = v2 + BigInt(unit8a[v1]);
            v1 = v1 + 1;
        };
		
        return  Number(v0%arg0);
  }

  
function select_numbers(arg1)  {
        let v1 = randomness(arg1);
        let v2 = 0;
		let result=[];
        while (v2 < 5) {
            v1 = randomness(v1);
            let v3 =safe_selection(35n, v1);
            while (result.indexOf(v3)!=-1) {
                let v4 = v1;
                v1 =randomness(v4);
                v3 =safe_selection(35n, v1);
            };
            result=result.concat([v3]);
            v2 = v2 + 1;
        };
        v1 =randomness(v1);
		return [result,safe_selection(10n,v1)];
    }







let j=0;
let i=0;
let dist=[];
let dist_sp=[]
while(j<20){
	let init_round_t=init_round+j;
	while(i<333){
		let round=init_round_t-(i*28800);
		let sig=await get_key(round);
		let byteArray = hex16String2Vector(sig);
		let [out_num,out_snum]=select_numbers(byteArray);
		console.log(out_num,out_snum);
		dist=dist.concat(out_num);
		dist_sp=dist_sp.concat([out_snum]);
		await setTimeout(1500);
		i+=1;
	}
	j+=1;
}

console.dir(dist, {depth: null, colors: true, maxArrayLength: null});
console.dir(dist_sp, {depth: null, colors: true, maxArrayLength: null});
