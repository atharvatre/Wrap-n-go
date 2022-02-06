const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const nodemailer = require('nodemailer');
const { response } = require('express');


const app= express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/user');


const userSchema=new mongoose.Schema({
    Firstname: {type: String },
    Lastname: {type: String },
    adress: {type: String},
    phonenum: {type: Number},
    email: {type: String},
    password: {type: String}
})

const User=new mongoose.model("User",userSchema)




app.get('/register',function(req,res){
    res.render('register')
    
})

app.get('/login',function(req,res){
    res.render('login')
})

app.get('/',function(req,res){
    res.render('home')
})

app.get('/update_pwd',function(req,res){
    res.render('update_pwd')
})

//--------------------------------------------------Register page-------------------------------
//post request from register page
app.post('/register',function(req,res){
    //checking if password field and confirm password fields are same
    if (req.body.password == req.body.password1){
        //checking if the email is already registered
        User.findOne({email:req.body.email},function(err,founduser){
            if(err){
                console.log(err);
            }else{
                if(founduser){
                    res.send('email already exists')
                }else{
                    User.findOne({phonenum:req.body.phnum},function(err,foundnum){
                        if(err){
                            console.log(err)
                        }else{
                            if(foundnum){//if already number is registered 
                                res.send('phone number already registered, please try using new number or login using previous one')
                            }
                            else{
                                //If phone number and email are not registered then create a new id for user 
                                //adding all the detais to the database
                                const newuser=new User({
                                    Firstname:req.body.fname,
                                    Lastname:req.body.lname,
                                    adress:req.body.adress,
                                    phonenum:req.body.phnum,
                                    email:req.body.email,
                                    password:req.body.password
                                })
                            
                                newuser.save(function(err){
                                    if(err){
                                        console.log(err)
                                    }else{
                                        res.redirect('/login')
                                    }
                                })
                            }
                        }
                    })

                    
                }
            }
        })
    
    
    
    

}else{
    //if password fields not matched then show error
    res.send('password not matched')
    res.render('register')
}  
});

//----------------------------------------------login page-------------------------------------

app.post('/login',function(req,res){
    User.findOne({email:req.body.email},function(err,founduser){
        if(err){
            res.send(err)
        }else{
            if(founduser){
                if(founduser.password==req.body.password){
                    res.redirect('/')
                }else{
                    res.send('Wrong Password')
                }
            }else{
                res.send('You are not registered')
            }
        }
    })
    
})


//------------------------mailing for update password-------------------
app.post('/update_pwd',function(req,res){
    var a=Math.floor(Math.random() * 9999) + 1000;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "nikhita.garg2020@vitbhopal.ac.in",
          pass: 'vit_Nik_10'
        }
      });
      
      message = {
        from: "nikhita.garg2020@vitbhopal.ac.in",
        to: req.body.email,
        subject: 'OTP to update password',
        text: a
   }
   transporter.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    })
    //------enter flash function???????????????????????????????
    res.end('Mail sent')

    if(a==req.body.otp){
        res.redirect('/login')
    }else{
        res.send('wrong password')
    }

    

});


app.listen(3000,function(){
    console.log('server created')
})

