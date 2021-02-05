# HW assignment AWS SDK and S3 presented in electron

## Run Locally
1. clone repo locally ```git clone```
2. Install node modules with the ```npm i``` command
3. Then run ```npm start``` and the server will be open on ```localhost:3000```, although this will not work on a browser and is only so electron can grab reacts DOM
4. Run the ```npm run electron``` command, which will open an electron window of the application
5. Make sure to set the AWS profile that you have created locally that has the ability to upload to S3, or this app will give you Access Denied