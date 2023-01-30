const collegeModel = require("../Models/CollegeModel");
const InternModel=require("../Models/InternModel")

const isValidaName=function (name) {
  const fnameRegex = /^[a-z]+$/ ;
  return fnameRegex.test(name.trim());
  
};


const isValidName = function (name) {
    const fnameRegex = /^[A-Za-z]+$/ ;
    return fnameRegex.test(name.trim());
    
};

const isValidFullName = function (fullname) {
  const validName = /^[a-z A-Z,]{1,50}$/;
  return validName.test(fullname);
};




let urlreg = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i




//------------------------------------------------------create collegeData--------------------------------------------

 

const createCollegeData = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin","*")
    try{
  let data = req.body;
  let { name, fullName, logoLink } = data;
  let fiterName=await collegeModel.findOne({"name":name})
  if (Object.keys(data).length==0) {
    res
      .status(400)
      .send({ status: false, msg: "plese enter some data in order to create" });
  } else if (name == undefined || name.trim() == "") {
    res
      .status(400)
      .send({ status: false,message: "plese enter the name of your college" });
  }else if(!isValidName(name)){
    res.status(400)
    .send({ status: false, message: "plese enter a valid name of your college" });
  
  }else if(!isValidaName(name)){
    res.status(400)
    .send({ status: false,  message:"college Name should only have lower case letters only" });
  
  }else if(fiterName){
    res.status(400)
    .send({ status: false, message: "this college name already exist in collection" });
  } else if (fullName == undefined || fullName.trim() == "") {
    res
      .status(400)
      .send({ status: false, message: "plese enter the fullName of your college" });
    
    }else if(!isValidFullName(fullName)){
       
        res.status(400)
        .send({ status: false, message: "plese enter a valid fullname of your college" });
      
        
    } else if (logoLink == undefined || logoLink.trim() == "") {
    res.status(400).send({ status: false, message: "plese enter logoLink" });

    }else if(!urlreg.test(logoLink)){
        res.status(400).send({ status: false, message: "plese enter valid logoLink" });
    
     } else if(data["isDeleted"]==true){
          return  res.status(400)
          .send({ status: false, message:"plese check your isDeleted key status" });
      
  
  
      } else {
    
    let collegeData = await collegeModel.create(data);
    res
      .status(201)
      .send({
        status: true,
        message: "your data is successfully created",
        data: collegeData,
      });
  }
}
catch(err){
    res.status(500).send({status:false,err:err.message})
}
};

module.exports.createCollegeData=createCollegeData

//-------------------------------------------------------------------------------------End------------------------------------
