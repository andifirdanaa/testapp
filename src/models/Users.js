import  Sequelize from "sequelize";
import db from '../config/database.js';

const { DataTypes } = Sequelize;

const users = db.define('users',{
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

export default users;
