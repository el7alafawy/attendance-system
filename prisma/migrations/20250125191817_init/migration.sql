BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [userType] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_userName_key] UNIQUE NONCLUSTERED ([userName])
);

-- CreateTable
CREATE TABLE [dbo].[Student] (
    [id] INT NOT NULL IDENTITY(1,1),
    [academicNumber] NVARCHAR(1000) NOT NULL,
    [studentName] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Student_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Student_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Student_academicNumber_key] UNIQUE NONCLUSTERED ([academicNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Professor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Professor_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Professor_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Course] (
    [id] INT NOT NULL IDENTITY(1,1),
    [courseName] NVARCHAR(1000) NOT NULL,
    [professorId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Course_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Course_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CourseEnrollment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [studentId] INT NOT NULL,
    [courseId] INT NOT NULL,
    [enrollmentDate] DATETIME2 NOT NULL CONSTRAINT [CourseEnrollment_enrollmentDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CourseEnrollment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CourseAttendance] (
    [id] INT NOT NULL IDENTITY(1,1),
    [studentId] INT NOT NULL,
    [courseId] INT NOT NULL,
    [sessionDate] DATETIME2 NOT NULL,
    [isPresent] BIT NOT NULL,
    CONSTRAINT [CourseAttendance_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Course] ADD CONSTRAINT [Course_professorId_fkey] FOREIGN KEY ([professorId]) REFERENCES [dbo].[Professor]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseEnrollment] ADD CONSTRAINT [CourseEnrollment_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseEnrollment] ADD CONSTRAINT [CourseEnrollment_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseAttendance] ADD CONSTRAINT [CourseAttendance_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseAttendance] ADD CONSTRAINT [CourseAttendance_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
