/*
  Warnings:

  - Added the required column `sessionId` to the `CourseAttendance` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Course] DROP CONSTRAINT [Course_professorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CourseAttendance] DROP CONSTRAINT [CourseAttendance_studentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CourseEnrollment] DROP CONSTRAINT [CourseEnrollment_courseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CourseEnrollment] DROP CONSTRAINT [CourseEnrollment_studentId_fkey];

-- AlterTable
ALTER TABLE [dbo].[CourseAttendance] ADD [sessionId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[CourseSession] (
    [id] INT NOT NULL IDENTITY(1,1),
    [courseId] INT NOT NULL,
    [sessionDate] DATETIME2 NOT NULL,
    [startTime] DATETIME2,
    [endTime] DATETIME2,
    [topic] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CourseSession_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CourseSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Course] ADD CONSTRAINT [Course_professorId_fkey] FOREIGN KEY ([professorId]) REFERENCES [dbo].[Professor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CourseSession] ADD CONSTRAINT [CourseSession_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseEnrollment] ADD CONSTRAINT [CourseEnrollment_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseEnrollment] ADD CONSTRAINT [CourseEnrollment_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseAttendance] ADD CONSTRAINT [CourseAttendance_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseAttendance] ADD CONSTRAINT [CourseAttendance_sessionId_fkey] FOREIGN KEY ([sessionId]) REFERENCES [dbo].[CourseSession]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
