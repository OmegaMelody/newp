const { pool } = require('../../db/database');

const checkLimit = async (req, res) => {
    const { user_id } = req.body;

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000); // 15 хвилин тому

    try {
        const result = await pool.query(
            `SELECT review_count, last_review_time
             FROM review_limits
             WHERE user_id = $1`,
            [user_id]
        );

        // Якщо запису немає — створюємо новий лічильник і дозволяємо залишити відгук
        if (result.rows.length === 0) {
            await pool.query(
                `INSERT INTO review_limits (user_id, review_count, last_review_time)
                 VALUES ($1, 1, $2)`,
                [user_id, now]
            );
            return res.status(200).json({ success: true });
        }

        const { review_count, last_review_time } = result.rows[0];
        const lastReviewTime = new Date(last_review_time);

        // Якщо минуло більше 15 хвилин — обнуляємо лічильник
        if (lastReviewTime < fifteenMinutesAgo) {
            await pool.query(
                `UPDATE review_limits
                 SET last_review_time = $1, review_count = 1
                 WHERE user_id = $2`,
                [now, user_id]
            );
            return res.status(200).json({ success: true });
        }

        // Якщо ліміт досягнуто — блокуємо можливість залишати відгуки
        if (review_count >= 3) {
            const remainingCooldown = Math.floor(
                (lastReviewTime.getTime() + 15 * 60 * 1000 - now.getTime()) / 1000
            );

            return res.status(429).json({ error: 'Ліміт досягнуто', remainingCooldown });
        }

        // Інакше — збільшуємо лічильник на 1
        await pool.query(
            `UPDATE review_limits
             SET review_count = review_count + 1
             WHERE user_id = $1`,
            [user_id]
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Помилка перевірки ліміту:", error);
        res.status(500).json({ error: 'Внутрішня помилка сервера.' });
    }
};

module.exports = { checkLimit };
