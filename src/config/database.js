import { Sequelize } from "sequelize";

const db = new Sequelize('test','root','',{
    host: "1.0.0.27",
    port: 3306,
    dialect: "mysql",
    define: {
        timestamps: false
    }
},)

export default db;