const { pool } = require('../db/database');


const getFilteredCategory2 = async (req, res) => {
        const { checkedCategories } = req.body;
        const whereConditions = checkedCategories.map((category, index) => `$${index + 1}`).join(', ');
        const query = `SELECT * FROM public.post WHERE category IN (${whereConditions});`;
        try {
          const result = await pool.query(query, checkedCategories);
          console.log('Query result:', result.rows);
          res.send(result.rows);
        } catch (error) {
          console.error('Error executing query', error.stack);
        }
      }
  




module.exports = {
    getFilteredCategory2,
}