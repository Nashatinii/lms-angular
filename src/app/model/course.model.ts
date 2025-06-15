export interface Course {
    name: string;
    instructor: string;
    id: string;
    description: string;
    archived: boolean;
    materials?: Material[];
}
export interface assignToStudents{
    studentName: string;
    courseName: string[];
}
export interface Material {
    type: 'lecture' | 'video' | 'assignment'; // Enum-like values for material types
    title: string; // Title of the material
    path? : string; //
    description?: string; // Optional description

}
export interface submittedAssignments {
    courseName: string;
    assignmentTitle: string;
    students: Array<{ studentName: string; url: string; grade: number }>;
}

export interface progress{
    studentName: string;
    coursesGrades: Array<{ progress: number; courseName: string; }>;
}