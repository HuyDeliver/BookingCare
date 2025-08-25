'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcode.hasMany(models.User, { foreignKey: 'positionID', as: 'positionData' })
            Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
            Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })
            Allcode.hasMany(models.Doctor_infor, { foreignKey: 'priceId', as: 'priceData' })
            Allcode.hasMany(models.Doctor_infor, { foreignKey: 'paymentId', as: 'paymentData' })
            Allcode.hasMany(models.Doctor_infor, { foreignKey: 'provinceId', as: 'provinceData' })
            Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })
        }
    };
    Allcode.init({
        key: DataTypes.STRING,
        type: DataTypes.STRING,
        value_EN: DataTypes.STRING,
        value_VN: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Allcode',
    });
    return Allcode;
};