const db = require("../models");

const searchBarServices = async (key) => {
    if (!key) return { errCode: 1, message: 'Missing search key' };

    let searchQuery = `%${key}%`;
    try {
        let results = await db.sequelize.query(
            `
            SELECT id, ("firstName" || ' ' || "lastName") AS name_kq, image AS image_url, 'doctor' AS type
            FROM "Users"
            WHERE ("firstName" || ' ' || "lastName") ILIKE :search AND "roleID"='R2'
            UNION ALL
            SELECT id, name AS name_kq, image AS image_url, 'specialty' AS type
            FROM "Specialties"
            WHERE name ILIKE :search
            UNION ALL
            SELECT id, name AS name_kq, image AS image_url, 'clinic' AS type
            FROM "Clinics"
            WHERE name ILIKE :search
            `,
            {
                replacements: { search: searchQuery },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        // Xử lý image_url cho từng phần tử trong results
        results = results.map(item => ({
            ...item,
            image_url: item.image_url && Buffer.isBuffer(item.image_url)
                ? Buffer.from(item.image_url, 'base64').toString('binary')
                : item.image_url || '' // Nếu không có image_url, trả về chuỗi rỗng
        }));

        return { errCode: 0, results };
    } catch (error) {
        console.error('Error in searchBarServices:', error);
        return { errCode: 1, message: 'Server error' };
    }
};

module.exports = {
    searchBarServices
};