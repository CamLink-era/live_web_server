let uid;

self.addEventListener('message',function(e){

  if (e.data['msg'] == "start"){
    uid = e.data['uid'];
    player();

  }else if (e.data['msg'] == "terminate"){
    worker.terminate();
  }else if (e.data['msg'] == "load"){
    player();
  }


});











function player(){

  loader();



}












let baseHost = "https://192.168.67.143";
let port = "5800";


function send(method,address,data={}, vid = "0", blob="0"){

  let host = baseHost + ":" + port + "/requester/";

  let request;

  let info = {
    'method':method,
    'address':address,
    'data':data,
    'vid':vid,
    'blob':blob,
  };
  
  request = new Request(host,{
    method:"POST",
    mode: 'no-cors',
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(info),
  });
  
  
  // console.log(host);

  return fetch(request)
  .then(response=>{
    if (!response.ok){
      throw new Error("unexpected error!");
    }

    if (vid == "1"){

      const contentType = response.headers.get('Content-Type');

      if (contentType.includes('application/json')){
        return response.json();
      }


      return response.arrayBuffer();
    }

    return response.json();
  })
  .then(response=>{

    return response;
  })
  .catch(error=>{
    console.log(error);
  })

}




let cid = 0;


function loader(){

  send("GET","live/play/",{"uid":uid,"cid":cid}, "1")
  .then(data=>{
    if (!data['msg']){
      this.self.postMessage(data);
      cid += 1;
    }else{
      setTimeout(()=>{
        loader();
      },1600);
    }
    
  });

}



