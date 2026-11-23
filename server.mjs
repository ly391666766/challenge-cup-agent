import http from 'node:http';
import {handleRequest} from './worker.mjs';
const port=Number(process.env.PORT || 3000);
http.createServer(async(req,res)=>{
  try {
    const request=new Request(new URL(req.url,'http://'+(req.headers.host||'localhost:'+port)),{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:req,duplex:'half'})});
    const response=await handleRequest(request,process.env);
    res.writeHead(response.status,Object.fromEntries(response.headers));
    if(response.body) for await(const chunk of response.body) res.write(chunk);
    res.end();
  } catch {res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:{message:'内部服务错误。'}}));}
}).listen(port,'0.0.0.0',()=>console.log('Agent listening on port '+port));
