const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Register a new student into MySQL
 */
export async function registerStudentApi(studentData) {
  const response = await fetch(`${API_BASE_URL}/auth/register-student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to submit student registration");
  }
  return data;
}

/**
 * Register a new faculty member into MySQL
 */
export async function registerFacultyApi(facultyData) {
  const response = await fetch(`${API_BASE_URL}/auth/register-faculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(facultyData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to submit faculty registration");
  }
  return data;
}

/**
 * Login user (Student USN / Staff)
 */
export async function loginUserApi(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(
      data.message || "Login failed. Please check credentials.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

/**
 * Update password (for first-time change or reset)
 */
export async function updatePasswordApi(username, newPassword) {
  const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update password.");
  }
  return data;
}

/**
 * Fetch authenticated profile using JWT token
 */
export async function getProfileApi(token) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch student profile.");
  }
  return data.profile;
}

export async function getFacultyProfileApi(token) {
  const response = await fetch(`${API_BASE_URL}/auth/faculty-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch faculty profile.");
  }
  return data.profile;
}

/* ====================================================
   ACADEMIC & HOD / FACULTY APIs
   ==================================================== */

export async function getDepartmentOverviewApi(dept = "EC") {
  const res = await fetch(`${API_BASE_URL}/academic/overview?dept=${dept}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch department stats");
  return data;
}

export async function getFacultiesApi(dept = "EC") {
  const res = await fetch(`${API_BASE_URL}/academic/faculties?dept=${dept}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch faculties");
  return data.faculties || [];
}

export async function getSubjectsApi(dept = "EC", semester = null) {
  const url = semester
    ? `${API_BASE_URL}/academic/subjects?dept=${dept}&semester=${semester}`
    : `${API_BASE_URL}/academic/subjects?dept=${dept}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch subjects");
  return data.subjects || [];
}

export async function getAllocationsApi(
  dept = "EC",
  semester = 3,
  section = "Section A",
  academicYear = "2026-27",
) {
  const res = await fetch(
    `${API_BASE_URL}/academic/allocations?dept=${dept}&semester=${semester}&section=${encodeURIComponent(section)}&academicYear=${encodeURIComponent(academicYear)}`,
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch allocations");
  return data.allocations || [];
}

export async function saveAllocationsApi(payload) {
  const res = await fetch(`${API_BASE_URL}/academic/allocate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save allocations");
  return data;
}

export async function getFacultyAssignedSubjectsApi(facultyId) {
  const res = await fetch(
    `${API_BASE_URL}/academic/faculty-subjects/${facultyId}`,
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch assigned subjects");
  return data.assignedSubjects || [];
}

export async function getStudentGradesApi(usn, semester = null) {
  const url = semester
    ? `${API_BASE_URL}/academic/student-grades/${usn}?semester=${semester}`
    : `${API_BASE_URL}/academic/student-grades/${usn}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch student academic records");
  return data;
}

export async function getStudentActivitiesApi(usn) {
  const res = await fetch(`${API_BASE_URL}/academic/student-activities/${usn}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || "Failed to fetch extracurricular activities",
    );
  return data;
}

export async function addStudentActivityApi(usn, payload) {
  const res = await fetch(
    `${API_BASE_URL}/academic/student-activities/${usn}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || "Failed to submit extracurricular activity",
    );
  return data;
}
