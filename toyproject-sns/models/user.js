const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.ENUM('local', 'kakao'),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,     // createdAt, updatedAt 자동으로 기록
      underscored: false,   // created_at, updated_at
      modelName: 'User',    // js에서 쓰는 이름
      tableName: 'users',   // db에서 쓰는 이름
      paranoid: true,       // deletedAt 자동으로 기록 (softdelete 방식 --> 복구 편리하게)
      charset: 'utf8',      // utf8mb4: 이모티콘 추가 가능
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',      // 컬럼에 대한 별명
      through: 'Follow',    // 중간 테이블 명
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',     // 컬럼에 대한 별명
      through: 'Follow',    // 중간 테이블 명
    });
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked'});
    db.User.hasMany(db.Comment);
  }
};

module.exports = User;