// Where a session works: the project's top folder, its record file, and the
// local time offset.
export type ProjectPlace = { projectPath: string; workingPath?: string; file: string; offsetMinutes: number }

// Finding the project a session is in, before anything else can be read.
export type ProjectRepository = {
  locate: (cwd: string, home: string) => Promise<ProjectPlace>
}
