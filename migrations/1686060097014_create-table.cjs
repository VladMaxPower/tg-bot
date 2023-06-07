/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('users', {
        user_id: {type: 'varchar(255)', primaryKey: true, foreignKeys: true},
        first_name: 'varchar(255)',
        last_name: 'varchar(255)',
        user_name: 'varchar(255)'
    });
    pgm.createTable('forbidden_words', {
        id: {type:'id',primaryKey:true,foreignKeys:true},
        word: 'varchar(255)'
    });
}