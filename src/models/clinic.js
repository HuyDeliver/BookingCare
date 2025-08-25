'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Clinic.hasMany(models.Doctor_infor, { foreignKey: 'clinicId' })
        }
    };
    Clinic.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.BLOB('long'),
        bgImage: DataTypes.BLOB('long')
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};