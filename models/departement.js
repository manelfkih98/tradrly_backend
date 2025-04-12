 const mongoose=require('mongoose')

 const DepartShema =new mongoose.Schema({
   NameDep:{
    type:String,
    require:true
   },
   DescrpDetp: {
    type:String,
    require:true
   }}
   ,{timeseries:true} );

   const departement= mongoose.model('departements',DepartShema);
   module.exports=departement;