const { pool } = require('../db/database');


const getTitle = async (req, res) => {
    try {
      const result = await pool.query('SELECT title FROM post', []);
      console.log(result.rows);
      res.json(result.rows);
    } catch (error) {
      console.log(error);
    }
  };
  
const getAllData =  async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM post');
        res.json(result.rows);
        console.log('result');
    } catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Помилка отримання даних' });
}
};
  
// app.get('/getFilteredCategory', async (req, res) => {
// const { categoryId } = req.query;
// try {
//     const result = await pool.query('SELECT * FROM post WHERE category = $1', [categoryId]);
//     res.json(result.rows);
//     console.log(categoryId);
// } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Помилка отримання відфільтрованих даних' });
// }
// });

// app.post('/getFilteredCategory2', async (req, res) => {
// const { checkedCategories } = req.body;
// const whereConditions = checkedCategories.map((category, index) => `$${index + 1}`).join(', ');
// const query = `SELECT * FROM public.post WHERE category IN (${whereConditions});`;
// try {
//     const result = await pool.query(query, checkedCategories);
//     console.log('Query result:', result.rows);
//     res.send(result.rows);
// } catch (error) {
//     console.error('Error executing query', error.stack);
// }
// });




module.exports = {
getTitle,
getAllData,
}