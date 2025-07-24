-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contact" ("createdAt", "email", "id", "message", "name", "phone", "subject", "updatedAt") SELECT "createdAt", "email", "id", "message", "name", "phone", "subject", "updatedAt" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE INDEX "Contact_email_idx" ON "Contact"("email");
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");
CREATE INDEX "Contact_status_idx" ON "Contact"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
