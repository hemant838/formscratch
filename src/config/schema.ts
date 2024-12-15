import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const JsonForms = pgTable("JsonForms", {
    id: serial("id").primaryKey(),
    jsonform: text("jsonform"),
    theme: varchar("theme").notNull().default("light"),
    background: varchar("background"),
    style: varchar("style"),
    createdBy: varchar("createdBy").notNull(),
    createdAt: varchar("createdAt").notNull(),
});

export const userResponses = pgTable("userResponses", {
    id: serial("id").primaryKey(),
    jsonresponse: text("jsonresponse").notNull(),
    createdBy: varchar("createdBy").default("anonymous"),
    createdAt: varchar("createdAt").notNull(),
    formRef: integer("formRef").references(()=>JsonForms.id),
});
