 const mongoose=require('mongoose')

 const AdminShema =new mongoose.Schema({
   fullName:{

    type:String,
    require:true
    
   },

   password: {

    type:String,
    require:true
   },

   email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Veuillez entrer un email valide.'] 
     },
   refreshTokens: [{ type: String }]
   }
   ,{timeseries:true} );

   const admin= mongoose.model('Admin',AdminShema);
   module.exports=admin;