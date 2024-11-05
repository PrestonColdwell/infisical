import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("user_secrets", (t) => {
    t.string("name", 50).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("user_secrets", (t) => {
    t.dropColumn("name");
  });
}
