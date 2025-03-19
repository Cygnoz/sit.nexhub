const mongoose = require('mongoose')

const DB = process.env.DATABASE

mongoose.connect(DB)
.then(()=>{
    console.log("📡...Sit Nexhub Database Connected Succesfully...📡");
}).catch((error)=>{
    console.log(`Database error ${error}`);
})

























// const mongoose = require('mongoose');
// const AWS = require('aws-sdk');

// // Configure AWS SDK with region
// const region = 'ap-south-1'; // Your AWS region
// AWS.config.update({ region });

// // Create an instance of the SSM (Systems Manager) client
// const ssm = new AWS.SSM();

// async function getDbCredentials() {
//   try {
//     // Fetch the parameter from AWS Parameter Store (with decryption enabled)
//     const params = {
//       Name: 'billbizz_DB1', // Replace with your parameter name
//       WithDecryption: true, // Ensure KMS decryption is used
//     };

//     const result = await ssm.getParameter(params).promise();
//     const credentials = result.Parameter.Value;
//     console.log('Fetched credentials:', credentials);
    
    
//     return credentials.dbUri;  
//   } catch (error) {
//     console.error('Error fetching credentials from Parameter Store:', error);
//     throw error;
//   }
// }

// async function connectToDatabase() {
//   try {
//     const dbUri = await getDbCredentials();
//     console.log(`Fetched MongoDB URI: ${dbUri}`);


//     mongoose.connect(dbUri)
// .then(()=>{
//     console.log("📡...BillBizz Database Connected Succesfully...📡");
// }).catch((error)=>{
//     console.log(`Database error ${error}`);
// })


//     console.log("📡...BillBizz Database Connected Successfully...📡");
//   } catch (error) {
//     console.log(`Database connection error: ${error}`);
//   }
// }

// // Initialize database connection
// connectToDatabase();




































