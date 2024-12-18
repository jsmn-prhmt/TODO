import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1660000000000 implements MigrationInterface {
  name = 'InitialMigration1660000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE \`group\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        deadline VARCHAR(255) NULL,
        completed BOOLEAN DEFAULT 0,
        userId INT NOT NULL,
        groupId INT NULL,
        FOREIGN KEY (userId) REFERENCES user(id),
        FOREIGN KEY (groupId) REFERENCES \`group\`(id)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`CREATE INDEX idx_task_deadline ON task(deadline);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_task_deadline ON task;`);
    await queryRunner.query(`DROP TABLE task;`);
    await queryRunner.query(`DROP TABLE \`group\`;`);
    await queryRunner.query(`DROP TABLE user;`);
  }
}