require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer')

const app = express();


app.set('view engine','ejs');

app.use(express.static('static'));


const SMTP_USER  = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

// console.log(SMTP_PASSWORD);


let mailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:SMTP_USER,
        pass:SMTP_PASSWORD
    }
});


app.get('/',(req,res)=>{
    res.render('index');
});


app.get('/register',(req,res)=>{

    res.render('register');
});


app.post('/register',express.urlencoded(),(req,res)=>{

    console.log(req.body);
    res.render('review',{data:req.body});
});


app.post('/send-data-to-mail',express.urlencoded(),(req,res)=>{
    let html = `
        <table>
            <tr>
                <th>STATE OF ORIGIN</th>
                <th>STATE OF DEPLOYMENT</th>
                <th>INSTITUTION</th>
                <th>COURSE OF STUDY</th>
                <th>SURNAME</th>
                <th>FIRST NAME</th>
                <th>CALL UP NUMBER</th>
            </tr>
            <tr>
                <td>${req.body.state_of_origin}</td>
                <td>${req.body.state_of_deployment}</td>
                <td>${req.body.institution}</td>
                <td>${req.body.course_of_study}</td>
                <td>${req.body.surname}</td>
                <td>${req.body.first_name}</td>
                <td>${req.body.call_up_number}</td>
            </tr>
        </table>
`;

   console.log(html);

   let payload = {
     from:"psalmyweb@gmail.com",
     to:"iamoluchimercy@gmail.com",
     subject:"TEst this",
     html:html
   }

   mailTransporter.sendMail(payload,(err)=>{
     if(err){
        console.log('An error occured');
        res.send('An error occured, could not submit you data')
     }
     else{
        console.log('Email sent!');
        res.render('thank_you_page');
    }
  });
});

app.post("/send-personal-info" , express.urlencoded() , (req,res)=>{

    let data = req.body.phone_number ? `
    
    User phone number: ${req.body.phone_number}
    `:
    `
    User Email Address: ${req.body.email}
    `
    let payload = {
        to:"iamoluchimercy@gmail.com",
        subject:"TEst this",
       text: data
      }
   
      mailTransporter.sendMail(payload,(err)=>{
        if(err){
           console.log('An error occured');
           res.send('An error occured, could not submit you data')
        }
        else{
           console.log('Email sent!');
           res.render('thank_you_page2');
       }
     });

} )

app.listen(4000,()=> console.log('Sever listening at port : 4000'));