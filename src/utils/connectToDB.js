import pkg from 'pg';
const { Pool } = pkg;

export default async function dbConnect (sql){
    try{
     const pool = new Pool({
         connectionString: process.env.DATABASE_URL
     });
     const data = await pool.query(sql);
     await pool.end();
     return data.rows;
        }catch (err){
        console.log(err);
    }
 }
