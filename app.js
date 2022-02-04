const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')


const app= express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))

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




app.post('/register',function(req,res){
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
                                        res.render('login')
                                    }
                                })
                            }
                        }
                    })

                    
                }
            }
        })
    
    
    
    

}else{
    res.send('password not matched')
    res.render('register')
}


    
    
});

/*app.post('/login')

app.get('/login',function(req,res){
    res.render('login')
})*/



app.listen(3000,function(){
    console.log('server created')
})