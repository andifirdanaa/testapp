import jwt from 'jsonwebtoken';
import connection from '../config/database.js';
import users from '../models/Users.js';
import bcrypt from 'bcrypt';


export const getUsers = async(req,res) => {
    try {
        const use = await users.findAll({
            attributes: ['id','name','email']
        });
        res.json(use);
    } catch (error) {
        console.log(error)
    }
}

export const register = async(req,res) => {
    const {name, email, password, confPassword} = req.body

    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password Tidak Cocok!"});
    
    const passwordToString = password.toString()
    const hashPassword = await bcrypt.hash(passwordToString, 10);

    try {
        await users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Register  Berhasil"});
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req,res) => {
    try {
        const user = await users.findAll({
            where: {
                email: req.body.email
            }
        });
        // console.log(user);
        const passwordToString = req.body.password.toString()
        const match = await bcrypt.compare(passwordToString, user[0].password);

        if(!match) return res.status(404).json({msg: "Wrong password"});

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        
        const accessToken = jwt.sign({ userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '360s'
        });
        const refreshToken = jwt.sign({userId, name, email},process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });

        res.cookie('id', userId, {
            httpOnly: true,
            maxAge: 24*60*60*1000
        });

        res.json({ accessToken });
    } catch (error) {
        // console.error();
        res.status(400).json({msg: "Email tidak ditemukan!"});
    }
}

export const changePassword = async (req,res) => {
    const {password, confPassword} = req.body
    const refresh = req.cookies.id;
    if(!refresh) return res.sendStatus(204);
    // console.log(refresh);
    try {
        // const user = await users.find(refresh);
        const user = await users.findAll({
            where: {
                id: refresh
            }
        });

        if(!user[0]) return res.sendStatus(404);

        const passwordToString = password.toString()
        const hashPassword = await bcrypt.hash(passwordToString, 10);

        user[0].password = hashPassword;
        await user[0].save();

        res.json({msg: 'berhasil di update'});

    } catch (error) {
        res.status(400).json({msg: "Gagal update password!"});
    }
}


