
const collegeModel = require("../Models/CollegeModel");
const InternModel=require("../Models/InternModel")


const validateEmail = function(email) {
    var re =/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
    return re.test(email)
};

const isValideName = function (name) {
    const fnameRegex = /^[A-Za-z]+$/ ;
    return fnameRegex.test(name);
    
};

 
const isValidName = function (name) {
    const fnameRegex = /^[a-z]+$/ ;
    return fnameRegex.test(name);
    
};



const isValidFullName = function (fullname) {
    let x=fullname.split('')
    
 x.forEach((y,i)=>{
    if(y==" "){
        x.splice(i,1)
    }
 })
    let reName=x.join('')
console.log(reName)
    const validName = /^[A-Za-z]+$/;
    console.log(validName.test(reName))
    return validName.test(reName);
  };
  

   
    



//-------------------------------------------------------------------------------------create InternData----------------------------------
const createIntern = async function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*")
    try{
    let data = req.body;
    let { name, mobile, email, collegeName } = data;
    let fiteremail=await InternModel.findOne({"email":email})
    let fitermobile=await InternModel.findOne({"mobile":mobile})
    if (Object.keys(data).length==0) {
      return res
        .status(400)
        .send({ status: false, message: "plese enter some data in order to create" });
    } else if (name == undefined || name.trim() == "") {
      res
        .status(400)
        .send({ status: false, message: "plese enter your name" });
    }else if(!isValidFullName(name.trim())){
        res.status(400)
        .send({ status: false, message: "plese enter a valid name" });
    }else if(email==undefined || email.trim()==""){
        return res
         .status(400)
         .send({ status: false, message: "plese enter your emailId" })
     
     }else if(!validateEmail(email.trim())){
        return res
         .status(400)
         .send({ status: false, message: "plese enter valid emailId" })
 
     }else if(fiteremail){
        return res
         .status(400)
         .send({ status: false, message: " emailId already registered" })  
    
    } else if(mobile==undefined || mobile.trim() ==""){
        res
        .status(400)
        .send({ status: false, message: "plese enter your mobieNumber" })

    }else if (!/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(mobile.trim())) {
        return res.status(400).send({ status:false, message:"Enter valid mobile number" })
    
    }else if(fitermobile){
        return res.status(400).send({ status:false, message:" mobile number already registered" })

    
    }else if (collegeName == undefined || collegeName.trim() == "") {
      return res
        .status(400)
        .send({ status: false, message: "plese enter of your collegeName" });
    }else if(!isValidName(collegeName.trim())){
       
       return  res.status(400)
        .send({ status: false, message: "plese enter a valid name of your college" });
    }else if(data["isDeleted"]==true){
        return  res.status(400)
        .send({ status: false, message:"plese check your isDeleted key status" });
    
    } else {
        
        let collegeFilter=await collegeModel.findOne({"name":collegeName})
        console.log(collegeFilter)
        if(collegeFilter==null){
            res.status(404).send({status:false,msg:`sorry we cant find college with ${collegeName} `})
        }else{
            data["email"]=email.trim()
            data["mobile"]=mobile.trim()
        data["collegeName"]=undefined
        data["collegeId"]=collegeFilter["_id"]
      let collegeData = await InternModel.create(data);
     return res
        .status(201)
        .send({
          status:true,
          message: "your data is successfully created",
          data: collegeData,
        
        });
    }
    }
}
catch(err){
    res.status(500).send({status:false,error:err.message})
}
  };


//------------------------------------------getDetails-------------------------------
const getDetails= async function(req,res){
     res.setHeader("Access-Control-Allow-Origin","*")
try{
    let data=req.query["collegeName"]
    if(!isValideName(data)){
        return res.status(400).send({status:false,message:`college name should only consist of alphabets`})
    }
    if(!data){
        return res.status(400).send({status:false,message:`plese enter collegeName  `})
    }
    console.log(data)
    let getData=await collegeModel.findOne({name:{$eq:data},isDeleted:false})
   

    if(!getData){
        res.status(404).send({status:false,message:`sorry no collage data found with this collegeName `})
    }
    else{
        let intern=await InternModel.find({"collegeId":{$eq:getData["_id"]},isDeleted:false}).select({name:1,email:1,mobile:1})
    
        getData["_id"]=undefined
        if(intern.length==0){
            getData["interns"]="no interns for this college"
        }
        else{
        getData["interns"]=intern
        }
        console.log(getData["interns"])
        let {name,fullName,logoLink,interns}=getData
        let resObject={name,fullName,logoLink,interns}
        res.status(200).send({status:true,msg:"here is your filtered data",data:resObject})

    }
}
catch(err){
    res.status(500).send({status:false,error:err.message})
}
}


module.exports.getDetails=getDetails
module.exports.createIntern=createIntern
