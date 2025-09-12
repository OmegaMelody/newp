const { pool } = require('../db/database');

const getreviews = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE "store_id" = $1 ORDER BY review_id DESC', [id]);
    console.log('result.rows');
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
};

// Вставка відгуків
const reviews = async (req, res) => {
  const { rating, review, idMarket, user_name, user_id, post_title, place_name } = req.body.data;

  try {
    // 🔎 Перевіряємо, скільки відгуків користувач вже залишив
    const check = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE store_id = $1 AND user_id = $2',
      [idMarket, user_id]
    );

    if (parseInt(check.rows[0].count) >= 2) {
      return res.status(400).json({ message: "Ви вже залишили максимум 2 відгуки для цього поста" });
    }

    // ✅ Використовуємо values тільки якщо дозволено вставку
    const values = [idMarket, user_name, rating, review, user_id, post_title, place_name];

    const insertQuery = `
      INSERT INTO reviews (store_id, user_name, grades, reviews, user_id, post_title, place_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, values);
    res.json(result.rows);

  } catch (error) {
    console.error("Помилка надсилання відгуку:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};


const editReview = async (req, res) => {
  const { reviewId, newReview, newRating } = req.body;

  // Повний варіант:
  // if (!reviewId || !newReview || !newRating) {
  //   return res.status(400).json({ message: "Invalid data" });
  // }

  // Тимчасовий варіант:
  if (!reviewId || !newReview ) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const updateQuery = `
    UPDATE reviews
    SET reviews = $1, grades = $2
    WHERE review_id = $3
    RETURNING *;
  `;

  try {
    const result = await pool.query(updateQuery, [newReview, newRating, reviewId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
      // Видалити всі реакції, пов'язані з відгуком
      await pool.query('DELETE FROM review_reactions WHERE review_id = $1', [reviewId]);

      // Видалити сам відгук
      const result = await pool.query('DELETE FROM reviews WHERE review_id = $1 RETURNING *', [reviewId]);

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Review not found' });
      }

      res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'An error occurred while deleting the review' });
  }
};


const getUserReviews = async (req, res) => {
  const { userId } = req.body;

  try {
      // Перший запит: отримання всіх відгуків користувача
      const reviewsResult = await pool.query(
          `SELECT * FROM reviews WHERE user_id = $1 ORDER BY review_id DESC`,
          [userId]
      );

      const reviews = reviewsResult.rows;

      // Ініціалізація порожнього масиву для зберігання назв постів
      const postTitles = [];

      // Прохід по кожному відгуку для отримання назви поста
      for (const review of reviews) {
          const postResult = await pool.query(
              `SELECT title FROM post WHERE id = $1`,
              [review.store_id]
          );  
          const postTitle = postResult.rows[0]?.title || 'Unknown';
          postTitles.push({ ...review, post_title: postTitle });
      }

      // Повернення об'єднаного результату
      res.json(postTitles);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
};
// Функція для збереження реакції користувача
const reactToReview = async (req, res) => {
  const { reviewId, userId, reactionType } = req.body;

  if (!reviewId || !userId || !reactionType) {
      return res.status(400).json({ message: "Невірні дані" });
  }

  try {
      // Перевіряємо, чи вже є реакція від цього користувача
      const existingReaction = await pool.query(
          'SELECT * FROM review_reactions WHERE review_id = $1 AND user_id = $2',
          [reviewId, userId]
      );

      if (existingReaction.rows.length > 0) {
          // Оновлюємо існуючу реакцію
          await pool.query(
              'UPDATE review_reactions SET reaction_type = $1 WHERE review_id = $2 AND user_id = $3',
              [reactionType, reviewId, userId]
          );
      } else {
          // Додаємо нову реакцію
          await pool.query(
              'INSERT INTO review_reactions (review_id, user_id, reaction_type) VALUES ($1, $2, $3)',
              [reviewId, userId, reactionType]
          );
      }

      res.json({ message: "Реакцію збережено успішно" });
  } catch (error) {
      console.error("Помилка при збереженні реакції:", error);
      res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// Функція для отримання реакцій для відгуків
const getReactions = async (req, res) => {
  const { reviewIds, userId } = req.body;

  if (!reviewIds || !Array.isArray(reviewIds)) {
      return res.status(400).json({ message: "Невірні дані" });
  }

  try {
      // Отримуємо кількість лайків та дизлайків для кожного відгуку
      const countsResult = await pool.query(
          `SELECT review_id, 
              SUM(CASE WHEN reaction_type = 1 THEN 1 ELSE 0 END) as likes,
              SUM(CASE WHEN reaction_type = -1 THEN 1 ELSE 0 END) as dislikes
           FROM review_reactions
           WHERE review_id = ANY($1)
           GROUP BY review_id`,
          [reviewIds]
      );

      // Отримуємо реакції поточного користувача
      let userReactions = {};
      if (userId) {
          const userReactionsResult = await pool.query(
              'SELECT review_id, reaction_type FROM review_reactions WHERE review_id = ANY($1) AND user_id = $2',
              [reviewIds, userId]
          );

          userReactionsResult.rows.forEach(row => {
              userReactions[row.review_id] = row.reaction_type;
          });
      }

      res.json({ counts: countsResult.rows, userReactions });
  } catch (error) {
      console.error("Помилка при отриманні реакцій:", error);
      res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

const removeReaction = async (req, res) => {
  const { reviewId, userId } = req.body;

  if (!reviewId || !userId) {
    return res.status(400).json({ message: "Невірні дані" });
  }

  try {
    // Видаляємо реакцію користувача для конкретного відгуку
    await pool.query(
      'DELETE FROM review_reactions WHERE review_id = $1 AND user_id = $2',
      [reviewId, userId]
    );

    res.json({ message: "Реакцію успішно видалено" });
  } catch (error) {
    console.error("Помилка при видаленні реакції:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};


module.exports = { getreviews, reviews, editReview, deleteReview, getUserReviews, getReactions, reactToReview,   removeReaction   };
